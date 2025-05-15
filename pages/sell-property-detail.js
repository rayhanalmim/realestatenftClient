import React, { useState, useEffect } from 'react'
import { Box, Button, Card, Container, Grid, Typography } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import { Controller, useForm } from "react-hook-form";
import { useDropzone } from 'react-dropzone';
import FormInput from "../components/FormInput";
import AuthNavbar from "../components/AuthNavbar";
import QueryInput from "../components/QueryInput";
import { useProperty } from "../context/PropertyContext";
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react'
import { create } from "ipfs-http-client";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMarketplace } from '../context/MarketplaceContext';
import { PROPERTY_NFT_ADDRESS } from '../Config';
import { ethers } from "ethers";
import { useAccount } from 'wagmi'
import { useToasts } from 'react-toast-notifications'
import { useTranslation } from 'react-i18next';


const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16
};

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: 'border-box'
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%'
};

export const Schema = Yup.object().shape({
    title: Yup.string().required("Cannot be empty"),
    overview: Yup.string().required("Cannot be empty"),
    detail: Yup.string().required("Cannot be empty"),
    price: Yup.number().required("Cannot be empty").label("Price"),
    location: Yup.string().required().min(1, "Required"),
    areaSize: Yup.number().required("Cannot be empty").label("Size"),
    bathroomNum: Yup.number().required("Cannot be empty").label("Bathroom number"),
    bedroomNum: Yup.number().required("Cannot be empty").label("Bedroom number"),
    propertyType: Yup.string().required().min(1, "Required"),
    pool: Yup.string().required().min(1, "Required")
});

const typeList = [
    { value: "apartment" , label: 'Apartment'},
    { value: "villa" , label: 'Villa'},
    { value: "bungalow" , label: 'Bungalow'},
    { value: "penthouse" , label: 'Penthouse'},
];

const cityList = [
  { value: 'istanbul', label: 'İstanbul'},
  { value: 'izmir', label: 'İzmir'},
  { value: 'antalya', label: 'Antalya'},
  { value: 'rize', label: 'Rize'},
  { value: 'muğla', label: 'Muğla'},
  { value: 'çanakkale', label: 'Çanakkale'},
  { value: 'ankara', label: 'Ankara'},
  { value: 'edirne', label: 'Edirne'},
];

const poolCheck = [
    { value: "yes" , label: "Yes"},
    { value: "no" , label: "No"},
];

const client = create({ url: "https://ipfs.infura.io:5001/api/v0" });

const SellPropertyDetail = () => {
    const [ loading, setLoading ] = useState(false);
    const [ fairValue, setFairValue] = useState(0);

    const { data: userData } = useAccount();


    console.log("user data from the sell property detail page", userData);

    const { addToast } = useToasts();

    const router = useRouter();

    const { t } = useTranslation();

    const { propertyContract } = useProperty();
    const { marketplace } = useMarketplace();
    
    const [images, setImages] = useState(null);

    const { getRootProps, getInputProps } = useDropzone({
      accept: {
        'image/*': []
      },
      maxFiles: 5,
      onDrop: acceptedFiles => {
        setImages(acceptedFiles.map(file => Object.assign(file, {
          preview: URL.createObjectURL(file)
        })));
      }
    });
  
    const thumbs = images && images.map(file => (
      <div style={thumb} key={file.name}>
        <div style={thumbInner}>
          <img
            src={file.preview}
            style={img}
            onLoad={() => { URL.revokeObjectURL(file.preview) }}
          />
        </div>
      </div>
    ));
  
    useEffect(() => {
      setFairValue(localStorage.getItem("fairValue"));

      // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
      return () => images && images.forEach(file => URL.revokeObjectURL(file.preview));
    }, []);

    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated: () => {
            setTimeout(() => {
                router.push('/')
            }, 3000)
        },
    })

    const { handleSubmit, control } = useForm({
        resolver: yupResolver(Schema),
    });

    const onSubmit = async (propertyForm) => { 
      if (!images) {
        addToast(t("sell_property_detail_image_message"), { 
          autoDismiss: true,
          appearance: 'error'
        });
        return;
      }
      if (images && (images.length < 2 || images.length > 5)) {
        addToast(t("sell_property_detail_image_length_message"), { 
          autoDismiss: true,
          appearance: 'error'
        });
        return;
      }

      if (propertyForm.price < fairValue) {
        addToast(t("sell_property_detail_price_message") + fairValue + " eth", { 
          autoDismiss: true,
          appearance: 'error'
        });
        return;
      }

      let cids = [];
  
      const files = images.map(image => ({ content: image }))
      for await (const result of client.addAll(files)) {
        cids.push(result.cid.toString());
      }

        const jsonForm = JSON.stringify({
          images: cids,
          title: propertyForm.title,
          overview: propertyForm.overview,
          detail: propertyForm.detail,
          location: propertyForm.location,
          areaSize: propertyForm.areaSize,
          bathroomNum: propertyForm.bathroomNum,
          bedroomNum: propertyForm.bedroomNum,
          propertyType: propertyForm.propertyType,
          pool: propertyForm.pool,
        });
        const addedFile = await client.add(jsonForm);
        await createMarketSale(addedFile.path, propertyForm.price);
    }

    const createMarketSale = async (tokenURI, price) => {

      setLoading(true);
      const tx = await propertyContract.mint(tokenURI);
      tx = await tx.wait();
    
      const tokenId = tx.events[0].args[2];

      tx = await marketplace.createListing(PROPERTY_NFT_ADDRESS, tokenId, ethers.utils.parseEther(price.toString()))
      tx = await tx.wait();

      addToast(t("toast_listed_message"), { 
        autoDismiss: true,
        appearance: 'success'
      });
      router.push("/main");
      setLoading(false);
    }

    return (
      <>
        {session ?
          <div>
            <AuthNavbar />
            <Card sx={{ marginTop: 12, display: 'flex', backgroundColor: '#eeeeee', boxShadow: 'none', height: 80 }}>
              <Container maxWidth="md">
                <Grid container>
                  <Grid item sx={{ marginTop: 2 }} xs={10}>
                    <Grid>
                      <Typography sx={{ fontFamily: 'Raleway', fontSize: 30, color: '#424242' }}>{t("sell_property_detail_page_title")}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Container>
            </Card>
            <Container maxWidth="md" sx={{ marginBottom: 10 }}>
              <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    marginBottom: 5
                }}
              >
                <Box noValidate sx={{ mt: 1 }}>
                  <form
                    noValidate
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <Grid container spacing={2} sx={{ maxWidth: 600 }}>
                      <Grid item xs={12}>
                        <Box marginBottom={2} backgroundColor="#eeeeee" height={180} padding={2}>
                          <section className="container">
                            <div {...getRootProps({ className: 'dropzone' })}>
                              <input {...getInputProps()} />
                              <Typography>
                                {t("sell_property_detail_image_field")}
                              </Typography>        
                            </div>
                            <aside style={thumbsContainer}>
                              {thumbs}
                            </aside>
                          </section>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Controller
                          name='title'
                          control={control}
                          render={(props) => (
                              <FormInput 
                                {...props}
                                required 
                                label={t("sell_property_detail_property_title_field")}
                              />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Controller
                          name='overview'
                          control={control}
                          render={(props) => (
                              <FormInput 
                                {...props} 
                                required 
                                label={t("sell_property_detail_preview_field")}
                                rows={2} 
                              />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Controller
                          name='detail'
                          control={control}
                          render={(props) => (
                              <FormInput 
                                {...props} 
                                required 
                                label={t("sell_property_detail_inform_field")}
                                rows={5} 
                              />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Controller
                          name='price'
                          control={control}
                          render={(props) => (
                              <FormInput 
                                {...props} 
                                required 
                                label={t("price_field") + " (eth)"}
                              />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sx={{ marginTop: 2 }}>
                        <Typography sx={{ fontFamily: 'Raleway', fontSize: 25, color: '#424242' }}>{t("sell_property_detail_page_title2")}</Typography>
                      </Grid>
                      <Grid container sx={{ m: 1, marginTop: 2 }}>
                        <Grid item>
                          <Controller
                            name='location'
                            control={control}
                            defaultValue=""
                            render={({ field }) => {
                              return (
                                <QueryInput 
                                  field={field}
                                  queryName={t("location_field")}
                                  options={cityList}
                                />
                              )
                            }} 
                          />
                        </Grid>
                        <Grid item xs={8} sx={{ m: 1 }}>
                          <Controller
                            name='areaSize'
                            control={control}
                            render={(props) => (
                                <FormInput 
                                  {...props} 
                                  required 
                                  label={t("living_area_field")}
                                />
                            )}
                          />
                        </Grid>
                        <Grid item xs={8} sx={{ m: 1 }}>
                          <Controller
                            name='bathroomNum'
                            control={control}
                            render={(props) => (
                                <FormInput 
                                  {...props} 
                                  required 
                                  label={t("sell_property_detail_bathroom_field")}
                                />
                            )}
                          />
                        </Grid>
                        <Grid item xs={8} sx={{ m: 1 }}>
                          <Controller
                            name='bedroomNum'
                            control={control}
                            render={(props) => (
                                <FormInput 
                                  {...props} 
                                  required 
                                  label={t("sell_property_detail_bedroom_field")}
                                />
                            )}
                          />
                        </Grid>
                        <Grid>
                          <Controller
                            name='propertyType'
                            control={control}
                            defaultValue=""
                            render={({ field }) => {
                              return (
                                <QueryInput 
                                  field={field}
                                  queryName={t("property_type_field")}
                                  options={typeList}
                                />
                              )
                            }} 
                          />
                        </Grid>
                        <Grid>
                          <Controller
                            name='pool'
                            control={control}
                            defaultValue=""
                            render={({ field }) => {
                              return (
                                <QueryInput 
                                  field={field}
                                  queryName={t("pool_field")} 
                                  options={poolCheck} 
                                />
                              )
                            }} 
                            />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid container sx={{ marginTop: 1 }}>
                      {!loading ? 
                        <div>
                          {userData ?
                            <Button
                              type="submit"
                              fullWidth
                              variant="contained"
                              sx={{ width: 200, mt: 3, mb: 2, backgroundColor: "#455a64", ':hover': { bgcolor: '#263238' }, textTransform: 'none', fontSize: 15 }}
                            >
                              {t("sell_property_detail_button")}
                            </Button>
                          :
                            <>
                              <Button
                                disabled
                                fullWidth
                                variant="contained"
                                sx={{ width: 200, mt: 3, mb: 2, textTransform: 'none', fontSize: 15 }}
                              >
                                {t("sell_property_detail_button")}
                              </Button> 
                              <Typography sx={{ fontSize: 13, marginLeft: 2, color: "#9e9e9e"}}>
                                {t("connect_wallet_message")}
                              </Typography>   
                            </>  
                          }
                        </div>
                      : 
                        <LoadingButton
                          loading
                          loadingPosition="start"
                          startIcon={<SaveIcon />}
                          variant="outlined"
                          sx={{ width: 200, textTransform: 'none', fontSize: 15, mt: 3, mb: 2 }}
                          >
                          {t("loading_process_button")}
                        </LoadingButton>
                      }
                    </Grid>
                  </form>
                </Box>
              </Box>
            </Container>
          </div>
          :
          <Grid container justifyContent="center" sx={{ marginTop: 35 }}>
              <Typography sx={{ fontSize: 30 }}>{t("loading_message")}</Typography>
          </Grid>
        }
      </>
    )
}
export default SellPropertyDetail;
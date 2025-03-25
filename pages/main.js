import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, Button } from '@mui/material';
import Properties from '../components/Properties';
import AuthNavbar from '../components/AuthNavbar';
import Footer from '../components/Footer';
import QueryInput from '../components/QueryInput';
import NoAuthNavbar from '../components/NoAuthNavbar';
import { useSession } from 'next-auth/react'
import { useProperty } from '../context/PropertyContext';
import axios from 'axios';
import { useMarketplace } from '../context/MarketplaceContext';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';


const cityList = [
    { value: 'İstanbul', label: 'İstanbul'},
    { value: 'izmir', label: 'İzmir'},
    { value: 'antalya', label: 'Antalya'},
    { value: 'rize', label: 'Rize'},
    { value: 'muğla', label: 'Muğla'},
    { value: 'çanakkale', label: 'Çanakkale'},
    { value: 'ankara', label: 'Ankara'},
    { value: 'edirne', label: 'Edirne'},
];

const typeList = [
    { value: 'apartment', label: 'Apartment'},
    { value: 'villa', label: 'Villa'},
    { value: 'bungalow', label: 'Bungalow'},
    { value: 'penthouse', label: 'Penthouse'},
];


const Main = () => {
    const [NFTs, setNFTs] = useState([]);
    const [NFTsCopy, setNFTsCopy] = useState([]);
    const [isSearchClicked, setIsSearchClicked] = useState(false);

    const [loading, setLoading] = useState(true);
    const { marketplace } = useMarketplace();
    const { propertyContract } = useProperty();

    const { t } = useTranslation();

    const { data: session, status } = useSession();

    const { handleSubmit, control } = useForm({});

    const onSubmit = (queryForm) => {
        setIsSearchClicked(true);
        const arr = [];

        NFTs.forEach((nft) => {
            if(queryForm.propertyType && queryForm.cityName) {
                if(queryForm.propertyType == nft.propertyType && queryForm.cityName == nft.location){
                    arr.push(nft);
                }
            }
            if(queryForm.propertyType && !queryForm.cityName) {
                if(queryForm.propertyType == nft.propertyType) {
                    arr.push(nft);
                }
            }
            if(!queryForm.propertyType && queryForm.cityName) {
                if(queryForm.cityName == nft.location) {
                    arr.push(nft);
                }
            }         
        });
        setNFTs(arr);
    }

    useEffect(() => {
        if (!marketplace) return;
        loadNFTs();
    }, [marketplace])

    const loadNFTs = async () => {
        setLoading(true);
        const data = await marketplace.getAllListings();
        const items = await Promise.all(
            data.map(async (nft) => {
                const tokenURI = await propertyContract.tokenURI(nft?.tokenId);
                const metadata = await axios.get(`https://ipfs.io/ipfs/${tokenURI}`);
                const property = {
                    areaSize: metadata.data.areaSize,
                    bathroomNum: metadata.data.bathroomNum,
                    bedroomNum: metadata.data.bedroomNum,
                    detail: metadata.data.detail,
                    location: metadata.data.location,
                    overview: metadata.data.overview,
                    pool: metadata.data.pool,
                    propertyType: metadata.data.propertyType,
                    title: metadata.data.title,
                    images: metadata.data.images,
                    seller: nft.seller,
                    owner: nft.owner,
                    tokenId: nft.tokenId.toNumber(),
                    listingId: nft.listingId.toNumber(),
                    price: nft.price,
                };
                return property;
            })
        );
        setNFTs(items);
        setNFTsCopy(items);
        setLoading(false);
    }

    const nftCopy = () => {
        setNFTs(NFTsCopy);
        setIsSearchClicked(false);
    }

    if (loading) {
        return (
            <Grid container justifyContent="center" sx={{ marginTop: 35 }}>
                <Typography sx={{ fontSize: 30}}>{t("fetch_data_message")}</Typography>
            </Grid>
        )
    }

    return (
        <>
            <div>
                {status === 'unauthenticated' ? <NoAuthNavbar page="main" /> : <AuthNavbar />}
                <Card sx={{ display: 'flex', backgroundColor: '#f5f5f5', boxShadow: 'none', height: 100 }}>
                    <Container maxWidth="lg">
                        <form
                            noValidate
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <Grid container>
                                <Grid item sx={{ marginTop: 1, marginRight: 5 }} xs={3}>
                                    <Grid>
                                        <Typography sx={{ fontFamily: 'Raleway', fontSize: 32, color: '#424242' }}>{t("main_page_adv_line1")}</Typography>
                                        <Typography sx={{ fontFamily: 'Raleway', fontSize: 25, color: '#424242' }}>{t("main_page_adv_line2")}</Typography>
                                    </Grid>
                                </Grid>
                                <Grid item sx={{ marginTop: 2 }}>
                                    <Grid container>
                                        <Grid item>
                                            <Controller
                                                name='cityName'
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
                                        <Grid item sx={{ width: 300 }}>
                                            <Controller
                                                name='propertyType'
                                                control={control}
                                                defaultValue=""
                                                render={({ field }) => {
                                                return (
                                                    <QueryInput 
                                                        field={field}
                                                        queryName={t("type_field")} 
                                                        options={typeList}
                                                    />
                                                )
                                                }} 
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item sx={{ margin: 1, marginTop: 4 }}>
                                    <Button  
                                        type="submit" 
                                        sx={{ 
                                                backgroundColor: '#5c6bc0', 
                                                color: 'white', width: 100, 
                                                height: 40, 
                                                ':hover': { bgcolor: '#3949ab' }, 
                                                textTransform: 'none', 
                                                fontSize: 16 
                                            }}
                                    >
                                        {t("search_button")}
                                    </Button>
                                </Grid>
                                <Grid item sx={{ margin: 1, marginTop: 4 }}>
                                {isSearchClicked &&
                                    <Button  
                                        onClick={() => nftCopy()}
                                        sx={{ 
                                                backgroundColor: '#9e9e9e', 
                                                color: 'white', width: 120, 
                                                height: 40, 
                                                ':hover': { bgcolor: '#616161' }, 
                                                textTransform: 'none', 
                                                fontSize: 16 
                                            }}
                                    >
                                        {t("reset_query_button")}
                                    </Button>
                                }
                                </Grid>
                            </Grid>
                        </form>
                    </Container>
                </Card>
                <Container maxWidth="lg" sx={{ marginTop: 3 }}>
                    <Grid container spacing={4}>
                        {NFTs.map((nft) => (
                            <Properties key={nft.listingId} post={nft} />
                        ))}
                    </Grid>
                    <Footer />
                </Container>
            </div>
        </>
    )
}

export default Main;


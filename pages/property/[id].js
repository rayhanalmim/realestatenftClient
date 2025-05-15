import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { Button, CardContent, Container, Typography, CardMedia, Card, Grid, Box, Paper, Divider } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import AuthNavbar from "../../components/AuthNavbar";
import Carousel from 'react-material-ui-carousel'
import Footer from '../../components/Footer';
import PropertyInformation from '../../components/PropertyInformation';
import NoAuthNavbar from '../../components/NoAuthNavbar';
import { useSession } from 'next-auth/react'
import { ethers, BigNumber } from 'ethers';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useProperty } from '../../context/PropertyContext';
import axios from 'axios';
import { ipfs } from '../../util/ipfsUtil';
import { useAccount, useBalance, useSigner } from 'wagmi';
import { useToasts } from 'react-toast-notifications'
import { useTranslation } from 'react-i18next';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BedIcon from '@mui/icons-material/Bed';
import BathtubIcon from '@mui/icons-material/Bathtub';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import PoolIcon from '@mui/icons-material/Pool';
import HomeWorkIcon from '@mui/icons-material/HomeWork';

const PropertyDetails = () => {
    const [nft, setNft] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const { marketplace } = useMarketplace();
    const { propertyContract } = useProperty();

    const marketplaceCommission = "1";
    const governmentCommission = "2";

    const { addToast } = useToasts();

    const { t } = useTranslation();

    const router = useRouter();
    const { id } = router.query;

    const { data: session, status } = useSession();
    const { data: signer } = useSigner();
    const { data: account } = useAccount();
    const { data: balance } = useBalance({ addressOrName: account?.address });
    
    useEffect(() => {
        if (!marketplace || !id) return;
        loadNFT();
    }, [id, marketplace])

    const loadNFT = async () => {
        try {
            const data = await marketplace.getSpecificListing(id);
            const tokenURI = await propertyContract.tokenURI(data.tokenId);
            const formattedURI = ipfs(tokenURI);
            const metadata = await axios.get(formattedURI);
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
                seller: data.seller,
                owner: data.owner,
                tokenId: data.tokenId.toNumber(),
                listingId: data.listingId.toNumber(),
                price: data.price,
            };
            setNft(property);
        } catch (error) {
            console.error("Error loading NFT details:", error);
        }
    }

    const buy = async () => {
        setLoading(true);

        if (!nft) return;

        const mCommission = nft.price.mul(BigNumber.from(marketplaceCommission)).div(BigNumber.from("100"));
        const gCommission = nft.price.mul(BigNumber.from(governmentCommission)).div(BigNumber.from("100"));

        const finalPrice = nft.price.add(mCommission.add(gCommission));
        const calculatedFinalPrice = ethers.utils.formatEther(finalPrice).toString();

        if(calculatedFinalPrice >= balance.formatted){
            addToast(t("toast_balance_message"), { 
                autoDismiss: true,
                appearance: 'error'
            });
            setLoading(false);
        }
        else{
            const tx = await marketplace.buy(nft.tokenId, { value: ethers.utils.parseUnits(calculatedFinalPrice, "ether"), gasLimit: 1000000 });
            await tx.wait();
            addToast(t("toast_bought_message"), { 
                autoDismiss: true,
                appearance: 'success'
            });
            router.push("/main");
            setLoading(false);
        }   
    }


    if (status === 'loading' || !nft) {
        return (
            <Grid container justifyContent="center" sx={{ marginTop: 35 }}>
                <Typography sx={{ fontSize: 30}}>{t("loading_message")}</Typography>
            </Grid>
        )
    }

    return (
        <>
            <div>
                {status === 'unauthenticated' ? <NoAuthNavbar page="main" /> : <AuthNavbar />}
                
                <Container maxWidth="xl" sx={{ py: 4 }}>
                    <Typography variant="h4" component="h1" sx={{ fontFamily: 'Raleway', fontWeight: 'bold', mb: 3 }}>
                        {nft.title}
                    </Typography>
                    
                    <Grid container spacing={4}>
                        {/* Left side - Images */}
                        <Grid item xs={12} md={7}>
                            <Box sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
                                <CardMedia
                                    component="img"
                                    height="450"
                                    image={ipfs(nft.images[selectedImageIndex])}
                                    alt={`Property image ${selectedImageIndex + 1}`}
                                    sx={{ objectFit: 'cover' }}
                                />
                            </Box>
                            
                            {/* Thumbnail images */}
                            <Box sx={{ display: 'flex', gap: 1, mt: 2, overflow: 'auto', pb: 1 }}>
                                {nft.images.map((image, index) => (
                                    <Box 
                                        key={index} 
                                        onClick={() => setSelectedImageIndex(index)}
                                        sx={{ 
                                            width: 100,
                                            height: 70,
                                            borderRadius: 1,
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                            border: index === selectedImageIndex ? '3px solid #d32f2f' : 'none',
                                            opacity: index === selectedImageIndex ? 1 : 0.7,
                                            transition: 'all 0.2s',
                                            '&:hover': { opacity: 1 }
                                        }}
                                    >
                                        <CardMedia
                                            component="img"
                                            height="70"
                                            image={ipfs(image)}
                                            alt={`Thumbnail ${index + 1}`}
                                            sx={{ objectFit: 'cover' }}
                                        />
                                    </Box>
                                ))}
                            </Box>
                        </Grid>
                        
                        {/* Right side - Property details */}
                        <Grid item xs={12} md={5}>
                            <Paper elevation={3} sx={{ p: 3, height: '100%', borderRadius: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                    <Typography variant="h4" component="div" sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
                                        {ethers.utils.formatEther(nft.price)} ETH
                                    </Typography>
                                    
                                    {status === "authenticated" && account && (
                                        !loading ? (
                                            <Button 
                                                onClick={() => buy()}
                                                variant="contained"
                                                sx={{ 
                                                    backgroundColor: '#d32f2f',
                                                    color: 'white', 
                                                    fontSize: 16, 
                                                    ':hover': { bgcolor: '#b71c1c'}, 
                                                    textTransform: 'none',
                                                    px: 4,
                                                    py: 1
                                                }}
                                            >
                                                {t("buy_property_button")}
                                            </Button>
                                        ) : (
                                            <LoadingButton
                                                loading
                                                loadingPosition="start"
                                                startIcon={<SaveIcon />}
                                                variant="outlined"
                                                sx={{ textTransform: 'none', fontSize: 15 }}
                                            >
                                                {t("loading_process_button")}
                                            </LoadingButton>
                                        )
                                    )}
                                    
                                    {(status === "unauthenticated" || !account) && (
                                        <Box>
                                            <Button 
                                                disabled
                                                sx={{ 
                                                    backgroundColor: '#bdbdbd',
                                                    width: 160, 
                                                    fontSize: 16,  
                                                    textTransform: 'none',
                                                    px: 3,
                                                    py: 1
                                                }}
                                            >
                                                {t("buy_property_button")}
                                            </Button>
                                            <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: "#9e9e9e"}}>
                                                {t("connect_wallet_message")}
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                                
                                <Divider sx={{ mb: 3 }} />
                                
                                {/* Location */}
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <LocationOnIcon sx={{ color: '#d32f2f', mr: 1 }} />
                                    <Typography variant="subtitle1">{nft.location}</Typography>
                                </Box>
                                
                                {/* Property features */}
                                <Grid container spacing={2} sx={{ mb: 3 }}>
                                    <Grid item xs={6}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <BedIcon sx={{ mr: 1, color: '#757575' }} />
                                            <Typography>{nft.bedroomNum} {t("bedroom_field")}</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <BathtubIcon sx={{ mr: 1, color: '#757575' }} />
                                            <Typography>{nft.bathroomNum} {t("bathroom_field")}</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <SquareFootIcon sx={{ mr: 1, color: '#757575' }} />
                                            <Typography>{nft.areaSize} m²</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <PoolIcon sx={{ mr: 1, color: '#757575' }} />
                                            <Typography>{nft.pool ? t("yes_field") : t("no_field")}</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <HomeWorkIcon sx={{ mr: 1, color: '#757575' }} />
                                            <Typography>{nft.propertyType}</Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                                
                                <Divider sx={{ mb: 3 }} />
                                
                                {/* Overview */}
                                <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    {t("property_info1")}
                                </Typography>
                                <Typography variant="body1" paragraph sx={{ color: '#424242' }}>
                                    {nft.overview}
                                </Typography>
                                
                                {/* Details */}
                                <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', mb: 1, mt: 3 }}>
                                    {t("property_info3")}
                                </Typography>
                                <Typography variant="body1" paragraph sx={{ color: '#424242' }}>
                                    {nft.detail}
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
                <Footer />
            </div>
        </>
    )
}

export default PropertyDetails;
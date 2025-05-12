import { Grid, Card, Container, Typography, Button } from "@mui/material";
import AuthNavbar from "../components/AuthNavbar";
import UserProperty from "../components/UserProperty";
import Footer from "../components/Footer";
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react'
import { useAccount, useSigner } from 'wagmi';
import { useMarketplace } from "../context/MarketplaceContext";
import { useProperty } from "../context/PropertyContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";


const SaleProperties = () => {
    const [NFTs, setNFTs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAccountExist, setIsAccountExist] = useState(true);

    const router = useRouter();

    const { t } = useTranslation();

    const { marketplace } = useMarketplace();
    const { propertyContract } = useProperty();

    const { data: account } = useAccount();

    const { data: session, status } = useSession({
        required: true,
		onUnauthenticated: () => {
            setTimeout(() => {
                router.push('/')
            }, 3000)
		},
    })

    useEffect(() => {
        if (!marketplace || !account){
            setLoading(false);
            setIsAccountExist(false);
        }
        loadSellerNFTs();
    }, [marketplace])


    const loadSellerNFTs = async () => {
        const data = await marketplace.getListingsCreated();
        
        const items = await Promise.all(
            data.map(async (nft) => {
                const tokenURI = await propertyContract.tokenURI(nft?.tokenId);
                const metadata = await axios.get(`${tokenURI}`);
                const property = {
                    location: metadata.data.location,
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
        setLoading(false);
    }

    if (!isAccountExist) {
        return (
            <Grid container direction="column" alignItems="center" justifyContent="center" sx={{ marginTop: 35 }}>
                <Grid item>
                    <Typography sx={{ fontSize: 30, color: "#424242"}}>{t("sale_properties_connect_wallet_message")}</Typography>
                </Grid>
                <Grid item sx={{ marginTop: 5 }}>
                    <Button
                        onClick={() => router.push('/profile')}
                        sx={{
                        backgroundColor: '#37474f',
                        textTransform: 'none',
                        color: 'white',
                        ':hover': { bgcolor: '#546e7a' },
                        width: 180,
                        height: 40
                        }}
                    >
                        {t("sale_properties_connect_wallet_button")}
                    </Button>
                </Grid>
            </Grid>
        )
    }

    if (loading) {
        return (
            <Grid container justifyContent="center" sx={{ marginTop: 35 }}>
                <Typography sx={{ fontSize: 30, color: "#424242"}}>{t("fetch_data_message")}</Typography>
            </Grid>
        )
    }

    return (
        <>
            {session ?   
            <div>
                <AuthNavbar />
                <Card sx={{ marginTop: 12, display: 'flex', backgroundColor: '#eeeeee', boxShadow: 'none', height: 80}}>
                    <Container maxWidth="lg">
                        <Grid container>
                            <Grid item sx={{ marginTop: 2 }} xs={3}>
                                <Grid>
                                    <Typography sx={{ fontFamily: 'Raleway', fontSize: 30, color: '#424242'}}>{t("sale_properties_page_title")}</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Container>
                </Card>
                <Container maxWidth="lg" sx={{ marginBottom: 10 }}>
                    {NFTs.map((nft) => (
                        <UserProperty property={nft} />
                    ))}
                </Container>
                <Footer />
            </div>
            : 
            <Grid container justifyContent="center" sx={{ marginTop: 35 }}>
                <Typography sx={{ fontSize: 30}}>{t("loading_message")}</Typography>
            </Grid>
            } 
        </>
    )
}

export default SaleProperties;
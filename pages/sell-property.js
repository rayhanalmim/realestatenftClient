import { Box, Button, Card, Container, Grid, Typography } from "@mui/material";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import FormInput from "../components/FormInput";
import AuthNavbar from "../components/AuthNavbar";
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react'
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useToasts } from 'react-toast-notifications'
import axios from "axios";

export const Schema = Yup.object().shape({
    deedNumber: Yup.string().required("Cannot be empty"),
    deedKey: Yup.string().required("Cannot be empty"),
});

const SellProperty = () => {

    const router = useRouter();

    const { t } = useTranslation();

    const { data: session, status } = useSession({
        required: true,
		onUnauthenticated: () => {
            setTimeout(() => {
                router.push('/')
            }, 3000)
		},
    })

    const { addToast } = useToasts()

    const { handleSubmit, control } = useForm({
        resolver: yupResolver(Schema)
    });

    const onSubmit = (deedForm) => {
        axios
            .post('/deed/deed_auth', {
                'deedNumber': deedForm["deedNumber"],
                'deedKey': deedForm["deedKey"]
            },
            {
                headers: { 'Content-Type': 'application/json' },
            })
            .then((result) => { 
                localStorage.setItem("fairValue", result.data);
            })
            .then(() => {
                addToast("Deed check completed successfully" , { 
                    autoDismiss: true,
                    appearance: 'success' 
                });
                setTimeout(() => 
                    router.push({ 
                        pathname: '/sell-property-detail',
                    }), 1500);
            })
            .catch((err) =>
                addToast(err?.response?.data, { 
                    autoDismiss: true,
                    appearance: 'error'
                })
            );
    }
 
    return (
        <>
        {session ? 
            <div>
                <AuthNavbar />
                <Card sx={{ marginTop: 12, display: 'flex', backgroundColor: '#eeeeee', boxShadow: 'none', height: 80}}>
                    <Container maxWidth="md">
                        <Grid container>
                                <Grid item sx={{ marginTop: 2 }} xs={10}>
                                    <Grid>
                                        <Typography 
                                            sx={{ 
                                                fontFamily: 'Raleway', 
                                                fontSize: 30, 
                                                color: '#424242'
                                            }}
                                        >
                                            {t("sell_property_page_title")}
                                        </Typography>
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
                                <Grid container spacing={2} sx={{ maxWidth: 600}}>
                                    <Grid item xs={12}>
                                        <Controller
                                            name='deedNumber'
                                            control={control}
                                            render={(props) => (
                                                <FormInput {...props} required label={t("sell_property_property_number_field")}/>
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Controller
                                            name='deedKey'
                                            control={control}
                                            render={(props) => (
                                                <FormInput {...props} required label={t("sell_property_property_code_field")}/>
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container sx={{ marginTop: 3}}>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{ width: 200, mt: 3, mb: 2 , backgroundColor: "#455a64", ':hover': { bgcolor: '#263238'}, textTransform: 'none', fontSize: 15}}
                                    >
                                        {t("sell_property_check_button")}
                                    </Button>
                                </Grid>
                            </form>
                        </Box>
                    </Box>
                </Container>
            </div>
            :
            <Grid container justifyContent="center" sx={{ marginTop: 35 }}>
                <Typography sx={{ fontSize: 30}}>{t("loading_message")}</Typography>
            </Grid>
            }
        </>
    )
}

export default SellProperty;
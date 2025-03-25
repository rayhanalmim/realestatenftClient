import React from 'react'
import { useRouter } from 'next/router'
import { useSession, signIn } from 'next-auth/react'
import { Button, Typography, Container, Card } from '@mui/material'
import { Grid } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useTranslation } from 'react-i18next';

const SignIn = () => {
    const { data: session, status } = useSession()
    const router = useRouter()
    
    const { t } = useTranslation()
    
    if (status === 'loading'){
        return (
            <Grid container justifyContent="center" sx={{ marginTop: 35 }}>
                <Typography sx={{ fontSize: 30}}>{t("sign_in_control_message")}</Typography>
            </Grid>
        )
    } 

    if (session) {
        setTimeout(() => {
            router.push('/main')
        }, 2000)

        return (
            <Grid container justifyContent="center" sx={{ marginTop: 35 }}>
                <Typography sx={{ fontSize: 30}}>{t("sign_in_message")}</Typography>
            </Grid>
        )
    }

    const handleOAuthSignIn = (provider) => () => signIn(provider)

    return (
        <Card sx={{ backgroundColor: "#f5f5f5", height: 755 }}>
            <Container maxWidth="sm">
                <Grid container justifyContent="center" alignItems="center" sx={{ marginTop: 35 }} direction="column">      
                    <Grid item sx={{ m: 2}}>
                        <Button
                            key='google'
                            onClick={handleOAuthSignIn('google')}
                            startIcon={<GoogleIcon />}
                            sx={{ 
                                color: "black",
                                border: '1px solid', 
                                fontSize: 20, 
                                textTransform: 'none', 
                                ':hover': { bgcolor: '#bdbdbd'
                            }}}
                        >
                            {t("sign_in_google")}
                        </Button>
                    </Grid> 
                </Grid>
            </Container>
        </Card>
    )
}

export default SignIn;
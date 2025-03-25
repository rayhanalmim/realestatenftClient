import Link from 'next/link';
import { Box, Button, Toolbar, Grid, AppBar} from '@mui/material';
import Image from 'next/image';
import { useRouter } from "next/router";
import ReactFlagsSelect from "react-flags-select";
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const NoAuthNavbar = (props) => {
    const [selectedLanguage, setSelectedLanguage] = useState("");
    const [selectedLanguageLabel, setSelectedLanguageLabel] = useState("Select Language");

    const { i18n, t } = useTranslation();
    
    useEffect(() => {
        i18n.changeLanguage(selectedLanguage);
        if(selectedLanguage == "gb") {
            setSelectedLanguageLabel("English")
        }
        if(selectedLanguage == "tr") {
            setSelectedLanguageLabel("Türkçe")
        }
    }, [selectedLanguage])

    const { push, asPath } = useRouter()
    
    const handleSignIn = () => push(`/auth/sign-in?callbackUrl=${asPath}`)

    return (
        <>
        {!props.page ? 
            <Toolbar sx={{ marginTop: 1}}>
                <Grid container justifyContent="space-between">
                    <Grid item>
                        <Box
                            component="img" 
                            src="logo3.png" 
                            sx={{ height: 90, width: 220}}
                        />
                    </Grid>
                    <Grid item sx={{ marginTop: 3 }}>
                        <Grid container direction="row">
                            <Grid item sx={{ marginRight: 3}}>
                                <Button 
                                    size="large" 
                                    onClick={handleSignIn} 
                                    sx={{ 
                                        backgroundColor: "#757575", 
                                        color: "white", 
                                        borderRadius: 2, 
                                        textTransform: 'none', 
                                        fontSize: "18px", 
                                        width: 100, 
                                        height: 40, 
                                        ':hover': { bgcolor: '#424242'} 
                                        }}
                                >
                                    {t('sign_in')}     
                                </Button>
                            </Grid>
                            <Grid item sx= {{ minWidth: 170}}> 
                                <ReactFlagsSelect 
                                    selected={selectedLanguage}
                                    onSelect={(code) => setSelectedLanguage(code.toLowerCase())}
                                    placeholder={selectedLanguageLabel}
                                    countries={["GB", "TR"]}
                                    customLabels={{ GB: "English", TR: "Turkish" }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Toolbar>
        : 
            <Box sx={{ margin: 12}}>
                <AppBar position="fixed" style={{ backgroundColor:"#455a64"}} >
                    <Toolbar>
                        <Link href="/">
                            <a>
                                <Image
                                    src="/logo2.png"
                                    width={200}
                                    height={70}
                                />
                            </a> 
                        </Link>
                        <Grid
                            justify="space-between"
                            container 
                            spacing={2}
                            justifyContent="center"
                            sx={{ maxWidth: 1100}}
                        >
                            <Grid item>
                                <Link href="/" style={{ textDecoration: 'none', color: 'white', }}>
                                    <Button variant="inherit" sx={{ textTransform: 'none', fontSize: 16}}>{t("navbar_home")}</Button>
                                </Link>
                            </Grid>    
                            <Grid item>
                                <Link href="/main" style={{ textDecoration: 'none', color: 'white', }}>
                                    <Button variant="inherit" sx={{ textTransform: 'none', fontSize: 16}}>{t("navbar_properties_page")}</Button>
                                </Link>
                            </Grid>          
                        </Grid> 
                        <Button 
                            onClick={handleSignIn} 
                            variant="inherit" 
                            sx={{ textTransform: 'none', fontSize: 16, width: 150 }}
                        >
                            {t('sign_in')}
                        </Button>
                    </Toolbar>
                </AppBar>
            </Box>
        }
        </>
    )
}

export default NoAuthNavbar;
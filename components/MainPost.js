import * as React from 'react';
import { Typography, Grid } from '@mui/material';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

const MainPost = () => {

    const { t } = useTranslation();
    return (
        <Grid container justifyContent="center" sx={{ marginTop: 6, marginBottom: 6}}>
            <Grid container justifyContent="center">
                <Typography component="h2" variant="h2" color="inherit">
                    {t("main_post_text1")}
                </Typography>
            </Grid>
            <Grid container justifyContent="center">
                <Typography component="h2" variant="h2" color="inherit" gutterBottom>
                    {t("main_post_text2")}
                </Typography>
            </Grid>
            <Grid container justifyContent="center">
                <Typography variant="h5" color="inherit">
                    {t("main_post_text3")}
                </Typography>
            </Grid>
            <Grid container justifyContent="center">
                <Typography variant="h5" color="inherit">
                    {t("main_post_text4")}
                </Typography>
            </Grid>
            <Grid container justifyContent="center">
                <Typography variant="h5" color="inherit" paragraph>
                    {t("main_post_text5")}
                </Typography>
            </Grid>
            <Grid container justifyContent="center">
                <Link href='/main'>
                    <a>
                        <Typography variant="h5" sx={{ color: "#263238", textDecoration: 'underline'}} display="inline">
                            {t("main_post_link")}
                        </Typography>
                    </a>
                </Link>
            </Grid>
            
        </Grid>
    );
}

export default MainPost;
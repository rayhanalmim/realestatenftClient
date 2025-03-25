import * as React from 'react';
import { Typography, Grid, Card, CardContent, CardMedia } from '@mui/material';
import { useTranslation } from 'react-i18next';

const MiddlePost = () => {

    const { t } = useTranslation();

    return(
        <Grid item xs={12} md={6}>
                <Card sx={{ display: 'flex', backgroundColor: '#f5f5f5', marginLeft: 1 }}>
                    <CardMedia
                        component="img"
                        sx={{ width: '45%', display: { xs: 'none', sm: 'block' } }}
                        image="https://static.news.bitcoin.com/wp-content/uploads/2019/10/uBRlFnvH-real-estate-crypto.jpg"
                    />
                    <CardContent sx={{ flex: 1, marginTop: 5, marginLeft: 3, maxWidth: 550}}>
                        <Typography component="h2" variant="h5" sx={{ marginBottom: 2}}>
                            {t("middle_post_title")}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            {t("middle_post_content")}
                        </Typography>  
                    </CardContent>
                </Card>
        </Grid>
    )
}

export default MiddlePost;
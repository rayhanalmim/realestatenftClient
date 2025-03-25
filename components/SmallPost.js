import * as React from 'react';
import { Typography, Grid, Card, CardContent, CardMedia, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

const SmallPost = () => {
    const { t } = useTranslation()

    return (
        <>
            <Box sx={{ flexGrow: 1, marginTop: 6, marginLeft: 5}}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card sx={{ height: 380}}>
                            <Grid style={{ display:'flex', justifyContent:'center' }}>
                                <CardMedia
                                    component="img"
                                    sx={{ marginTop: "10px", width: 120, height: 120, borderRadius: '50%'}}
                                    image='https://argonaut.au.reastatic.net/resi-property/prod/homepage-web/guides-selling-47d7f52fdaf669353712.webp'
                                />
                            </Grid>
                            <CardContent sx={{ flex: 1, maxWidth: 350, marginTop: 2 }}>
                                <Typography component="h2" variant="h5">
                                    {t("small_post1_title")}
                                </Typography>
                                <br />
                                <Typography variant="subtitle1" paragraph>
                                    {t("small_post1_desc")}
                                </Typography>
                            </CardContent>                          
                        </Card>
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{ flexGrow: 1, marginTop: 6, marginLeft: 5}}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card sx={{ height: 380}}>
                            <Grid style={{ display:'flex', justifyContent:'center' }}>
                                <CardMedia
                                    component="img"
                                    sx={{ marginTop: "10px", width: 120, height: 120, borderRadius: '50%'}}
                                    image='https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/2048px-Ethereum-icon-purple.svg.png'
                                />
                            </Grid>
                            <CardContent sx={{ flex: 1, maxWidth: 350, marginTop: 2 }}>
                                <Typography component="h2" variant="h5">
                                    {t("small_post2_title")}
                                </Typography>
                                <br />
                                <Typography variant="subtitle1" paragraph>
                                    {t("small_post2_desc")}
                                </Typography>
                            </CardContent>                          
                        </Card>
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{ flexGrow: 1, marginTop: 6, marginLeft: 5}}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card sx={{ height: 380}}>
                            <Grid style={{ display:'flex', justifyContent:'center' }}>
                                <CardMedia
                                    component="img"
                                    sx={{ marginTop: "10px", width: 120, height: 120, borderRadius: '50%'}}
                                    image='https://cdn2.iconfinder.com/data/icons/summer-travel-5/64/Summer-Travel-spend-Time-hour-512.png'
                                />
                            </Grid>
                            <CardContent sx={{ flex: 1, maxWidth: 350, marginTop: 2 }}>
                                <Typography component="h2" variant="h5">
                                    {t("small_post3_title")}
                                </Typography>
                                <br />
                                <Typography variant="subtitle1" paragraph>
                                    {t("small_post3_desc")}
                                </Typography>
                            </CardContent>                          
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </>
        
    )
}

export default SmallPost;
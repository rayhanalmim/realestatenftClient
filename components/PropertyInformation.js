import React from 'react';
import { CardContent, Typography, Divider, Card, Box, Grid } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import BedroomParentIcon from '@mui/icons-material/BedroomParent';
import ShowerIcon from '@mui/icons-material/Shower';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import PoolIcon from '@mui/icons-material/Pool';
import { useTranslation } from 'react-i18next';


const PropertyInformation = (props) => {

    const { t } = useTranslation();

    const { propertyInfo, title, type } = props;

    return (
        <Card sx={{ display: 'flex', backgroundColor: '#f5f5f5'}}>
            <CardContent sx={{ marginTop: 4, marginLeft: 2, marginRight: 5}}>
                <Typography sx={{ fontSize: 23, width: 170, fontFamily: 'Raleway'}}>{title}</Typography>
            </CardContent>
            <CardContent>
                <Divider orientation="vertical"/>   
            </CardContent>
            <CardContent>
                {type == "Overview" ?
                        <Typography sx={{ marginTop: 1 }}>{propertyInfo.overview}</Typography> 
                        :
                        <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                height: 93
                             }}
                        >
                            <Box item>
                                <Grid container spacing={1} sx={{ marginTop: 1}}>
                                    <Grid item>
                                        <HomeIcon />
                                    </Grid>
                                    <Grid item>
                                        <Typography sx = {{ textTransform: 'capitalize' }}>
                                            {t("property_type_field")}: {propertyInfo.propertyType}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={1} sx={{marginTop: 0}}>
                                    <Grid item>
                                        <BedroomParentIcon />
                                    </Grid>
                                    <Grid item>
                                        <Typography>
                                            {t("bedroom_field")}: {propertyInfo.bedroomNum}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                            <Box item sx={{ marginLeft: 3 }}>
                                <Divider orientation="vertical"/>   
                            </Box>  
                            <Box item sx={{ marginLeft: 3 }}>
                                <Grid container spacing={1} sx={{ marginTop: 1}}>
                                    <Grid item>
                                        <ShowerIcon />
                                    </Grid>
                                    <Grid item>
                                        <Typography>
                                            {t("bathroom_field")}: {propertyInfo.bathroomNum}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={1} sx={{marginTop: 0}}>
                                    <Grid item>
                                        <LocationOnIcon />
                                    </Grid>
                                    <Grid item>
                                        <Typography>
                                            {t("location_field")}: {propertyInfo.location}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                            <Box item sx={{ marginLeft: 3 }}>
                                <Divider orientation="vertical"/>   
                            </Box>
                            <Box item sx={{ marginLeft: 3 }}>
                                <Grid container spacing={1} sx={{ marginTop: 1}}>
                                    <Grid item>
                                        <SquareFootIcon />
                                    </Grid>
                                    <Grid item>
                                        <Typography>
                                            {t("living_area_field")}: {propertyInfo.areaSize}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={1} sx={{marginTop: 0}}>
                                    <Grid item>
                                        <PoolIcon />
                                    </Grid>
                                    <Grid item>
                                        <Typography sx = {{ textTransform: 'capitalize' }}>
                                            {t("pool_field")}: {propertyInfo.pool}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>      
                    }
            </CardContent>
        </Card>
    )
}
export default PropertyInformation;
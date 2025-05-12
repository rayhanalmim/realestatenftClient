import * as React from 'react';
import { Typography, Grid, Card, CardActionArea, CardContent, CardMedia, Box } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BedroomParentIcon from '@mui/icons-material/BedroomParent';
import ShowerIcon from '@mui/icons-material/Shower';
import { ethers } from "ethers";
import Link from 'next/link';
import { ipfs } from '../util/ipfsUtil';


const Properties = (props) => {
    const { post } = props;

    console.log('here isthe post data',post);
    
    return (
        <Box sx={{ flexGrow: 1, marginTop: 6, marginLeft: 2, maxWidth: 280, minWidth: 280}}>
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Link href={`/property/${post.listingId}`}>
                        <CardActionArea component="a" href={`/property/${post.listingId}`}>
                            <Card>
                                <Grid style={{ display:'flex', justifyContent:'center' }}>
                                    <CardMedia
                                        component="img"
                                        sx={{ height: 200}}
                                        image={post.images[0]}
                                        alt=""
                                    />
                                </Grid>
                                <CardContent sx={{ flex: 1, maxWidth: 300 }}>
                                    <Typography sx= {{ fontWeight: "bold", fontSize: 18, textTransform: 'capitalize' }}>
                                        {post.title}
                                    </Typography>
                                    <Typography variant="subtitle1" paragraph sx={{ marginTop: 1, textTransform: 'capitalize'}}>
                                        {post.overview.substring(0,100)} ...
                                    </Typography>
                                    <Box 
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            flexWrap: 'nowrap',
                                            bgcolor: 'background.paper',
                                            maxWidth: 300,
                                        }}>
                                            <LocationOnIcon sx={{ marginRight: -1}}/>
                                            <Typography sx={{textTransform: 'capitalize'}}>
                                                {post.location}
                                            </Typography> 
                                            <BedroomParentIcon sx={{ marginRight: -1}} /> {post.bedroomNum}
                                            <ShowerIcon sx={{ marginRight: -1}}/> {post.bathroomNum}
                                            <Typography>{post.areaSize} sq.m</Typography>
                                    </Box>
                                    <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            flexWrap: 'nowrap',
                                            bgcolor: 'background.paper',
                                            maxWidth: 300,
                                            marginLeft: 1,
                                            marginRight: 1,
                                            marginTop: 3    
                                        }}>
                                            <Box item>
                                                <Typography sx={{ fontSize: 20, fontWeight: 'bold'}}>
                                                    {ethers.utils.formatEther(post.price)} ETH 
                                                </Typography>
                                            </Box>
                                            <Box item sx={{backgroundColor: '#e8f5e9', borderRadius: '10%'}}>
                                                <Typography sx={{ fontSize: 20, marginLeft:1, marginRight:1, textTransform: 'capitalize'}} >
                                                    {post.propertyType}
                                                </Typography>
                                            </Box>
                                    </Box>
                                </CardContent>                          
                            </Card>
                        </CardActionArea>
                    </Link>
                </Grid>
            </Grid>
        </Box>
    )
}

export default Properties;
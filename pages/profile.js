import { React, useEffect, useState } from 'react';
import { Card, CardContent, Container, Grid, Typography, Box, Divider, Button } from "@mui/material";
import AuthNavbar from "../components/AuthNavbar";
import { useSession } from 'next-auth/react'
import PersonIcon from '@mui/icons-material/Person';
import { useRouter } from 'next/router';
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { useTranslation } from 'react-i18next';

const Profile = () => {
  const { isConnected, connect } = useConnect({
    connector: new InjectedConnector(),
  })
  const { disconnect } = useDisconnect()
  const { data: userData } = useAccount();

  const router = useRouter()

  const { t } = useTranslation();

  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated: () => {
      setTimeout(() => {
        router.push('/')
      }, 3000)
    },
  })

  return (
    <>
      {session ?
        <div>
          <AuthNavbar />
          <Card sx={{ backgroundColor: '#f5f5f5', marginTop: -1 }}>
            <Container maxWidth="sm">
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  m: 1,
                  marginBottom: 10
                }}
              >
                <Box sx={{ marginTop: 5, backgroundColor: '#616161', width: 160, height: 160, borderRadius: '50%' }}>
                  <Grid container justifyContent="center" alignItems="center">
                    <PersonIcon sx={{ color: 'white', marginTop: 4, fontSize: 80 }} />
                  </Grid>
                </Box>
                <Card sx={{ backgroundColor: "#616161", marginTop: 5, width: 750, height: 150, boxShadow: "0" }}>
                  <CardContent sx={{ marginLeft: 2, marginTop: 2 }}>
                    <Grid container justifyContent="space-between">
                      <Grid item>
                        <Typography sx={{ fontSize: 18, color: 'white' }}>{t("profile_name_field")}</Typography>
                        <Typography sx={{ fontSize: 15, color: 'white', marginTop: 2 }}>{session.user.name}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
                <Card sx={{ backgroundColor: "#616161", marginTop: 3, width: 750, height: 150, boxShadow: "0" }}>
                  <CardContent sx={{ marginLeft: 2, marginTop: 2 }}>
                    <Grid container justifyContent="space-between">
                      <Grid item>
                        <Typography sx={{ fontSize: 18, color: 'white' }}>Email</Typography>
                        <Typography sx={{ fontSize: 15, color: 'white', marginTop: 2 }}>{session.user.email}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
                <Card sx={{ backgroundColor: "#616161", marginTop: 3, width: 750, height: 200, boxShadow: "0" }}>
                  <CardContent sx={{ marginLeft: 2, marginTop: 2 }}>
                    <Grid container justifyContent="space-between">
                      <Grid item>
                        <Typography sx={{ fontSize: 18, color: 'white', marginTop: 2 }}>{t("profile_walletAddress_field")}</Typography>
                        <Divider sx={{ m: 1, width: 200, marginLeft: 0, backgroundColor: "white" }} />
                        {userData ?
                          <Typography color="white">
                            {userData.address.slice(0, 5) + "...." + userData.address.slice(userData.address.length - 5, userData.address.length)}
                          </Typography>
                          :
                          <Typography color="white">
                            {t("profile_walletAddress_message")}
                          </Typography>
                        }
                      </Grid>
                      {isConnected ? 
                        <Button
                          onClick={() => disconnect()}
                          sx={{
                            textTransform: 'none',
                            backgroundColor: '#424242',
                            color: 'white',
                            ':hover': { bgcolor: '#9e9e9e' },
                            width: 120,
                            height: 50,
                            m: 5
                          }}
                        >
                          {t("disconnect_wallet_button")}
                        </Button> 
                      : 
                        <Button
                          onClick={() => connect()}
                          sx={{
                            backgroundColor: '#424242',
                            textTransform: 'none',
                            color: 'white',
                            ':hover': { bgcolor: '#9e9e9e' },
                            width: 120,
                            height: 50,
                            m: 5
                          }}
                        >
                          {t("connect_wallet_button")}
                        </Button>
                      }
                    </Grid>
                  </CardContent>
                </Card>
              </Box>
            </Container>
          </Card>
        </div>
        :
        <Grid container justifyContent="center" sx={{ marginTop: 35 }}>
          <Typography sx={{ fontSize: 30 }}>{t("loading_message")}</Typography>
        </Grid>
      }
    </>
  )
}

export default Profile;
import { Card, Box, Typography, Grid, Container, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MainPost from '../components/MainPost';
import SmallPost from '../components/SmallPost';
import Footer from '../components/Footer';
import MiddlePost from '../components/MiddlePost';
import NoAuthNavbar from '../components/NoAuthNavbar';
import { useTranslation } from 'react-i18next';

const theme = createTheme();

export default function Home() {
  const { t } = useTranslation();

  return (
    <Card sx={{ backgroundColor: "#f5f5f5" }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="xl">
          <NoAuthNavbar />
          </Container>
          <Grid container justifyContent="center">
            <Box sx={{ width: 1300 }}>
              <MainPost />  
            </Box>
          </Grid>
        <Container maxWidth="lg">
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: "bold", 
                margin: 2, 
                marginTop: 4, 
                marginBottom: 3
              }}
            >
              {t("small_posts_title")}
            </Typography>
            <Grid container spacing={4}>
              <SmallPost />
            </Grid>
            <Grid sx={{ marginTop: 8}}>
              <MiddlePost />
            </Grid>
        </Container>
        <Footer/>
      </ThemeProvider>
    </Card>
  )
}

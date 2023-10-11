import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Typography, Container, Box } from '@mui/material';

// ----------------------------------------------------------------------

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function PageDetailInfoError() {
  return (
    <>
      <Helmet>
        <title> 䒳芮線上人資系統 </title>
      </Helmet>

      <Container>
        <StyledContent sx={{ textAlign: 'center', alignItems: 'center' }}>
          <Typography variant="h3" paragraph>
            尚未註冊個人詳細訊息 <br/>
            請通知貴司人資
          </Typography>

          <Typography sx={{ color: 'text.secondary' }}>
              You have not registered your personal details yet. Please notify the HR department.
          </Typography>

          <Box
            component="img"
            src="/image/searching.png"
            sx={{ height: 260, mx: 'auto', my: { xs: 5, sm: 10 } }}
          />

          {/* <Button to="/" size="large" variant="outlined" component={RouterLink}>
            Go to Home
          </Button> */}
        </StyledContent>
      </Container>
    </>
  );
}

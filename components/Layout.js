import media from 'css-in-js-media';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import GlobalStyles from '../styles/GlobalStyles';
import Footer from './Footer';
import Navbar from './Navbar';
 
  
function Layout({ title, keywords, description, children }) {
  const router = useRouter();
 
  return (
    <div>
         <Head>
          <title>{title}</title>
          <meta name='description' content={description} />
          <meta name='keywords' content={keywords} />
          <link rel='icon' href='/favicon.ico' />
          <link
            rel='stylesheet'
            href='https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,400;0,700;1,400&display=swap'
          />
        </Head>
        <GlobalStyles />
        <Navbar />
         <Container> {children}</Container>
        <Footer />
     </div>
  );
}
Layout.defaultProps = {
  title: 'NotDev | Write awesome blogs about tech',
  description: 'We help brands by connecting their goals with customer motivation',
  keywords: 'agency, brand, design, development, seo',
};

const Container = styled.div`
  margin: 0 auto;
  height: 90vh;
  padding: 0 2rem;
  ${media('<=phone')} {
    max-width: 95%;
    padding: 0 1rem;
  }
`;
export default Layout;
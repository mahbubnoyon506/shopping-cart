import Container from "@/components/Container";
import HomeBanner from "@/components/HomeBanner";
import HomeCategories from "@/components/HomeCategories";
import LatestBlog from "@/components/LatestBlog";
import ProductGrid from "@/components/ProductGrid";
import ShopByBrands from "@/components/ShopByBrands";

export default async function Home() {
  return (
    <Container className="shop_light_pink">
      <HomeBanner />
      <ProductGrid />
      <HomeCategories />
      <ShopByBrands />
      <LatestBlog />
    </Container>
  );
}

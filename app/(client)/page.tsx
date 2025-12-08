import Container from "@/components/Container";
import HomeBanner from "@/components/HomeBanner";
import ProductGrid from "@/components/ProductGrid";

export default function Home() {
  return (
    <Container className="shop_light_pink">
      <HomeBanner />
      <ProductGrid />
    </Container>
  );
}

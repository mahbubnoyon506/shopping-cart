"use client";
import Container from "@/components/Container";
import { useGetProducts } from "@/components/hooks/useFetchProducts";
import ProductCard from "@/components/ProductCard";
import { Title } from "@/components/ui/text";
import { Product } from "@/utils/types";

const DealPage = () => {
  const { data, isLoading, isError } = useGetProducts();
  const dealProducts = data?.data?.length
    ? data?.data?.filter((item: Product) => item.status === "hot")
    : [];
  return (
    <div className="py-10 bg-deal-bg">
      <Container>
        <Title className="mb-5 underline underline-offset-4 decoration-[1px] text-base uppercase tracking-wide">
          Hot Deals of the Week
        </Title>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {dealProducts?.map((product: Product) => (
            <ProductCard key={product?._id} product={product} />
          ))}
        </div>
      </Container>
    </div>
  );
};

export default DealPage;

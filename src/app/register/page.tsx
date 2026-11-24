import { BuyerAuthPage } from "@/components/BuyerAuthPage";

export default function Register({ searchParams }: PageProps<"/register">) {
  return <BuyerAuthPage mode="register" searchParams={searchParams} />;
}

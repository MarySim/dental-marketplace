import { BuyerAuthPage } from "@/components/BuyerAuthPage";

export default function Login({ searchParams }: PageProps<"/login">) {
  return <BuyerAuthPage mode="login" searchParams={searchParams} />;
}

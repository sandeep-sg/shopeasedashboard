import DashboardIcon from "../components/icons/DashboardIcon";
import OrderIcon from "../components/icons/OrderIcon";
import ProductIcon from "../components/icons/ProductIcon";

export const navLinks = [
    {
      name: "Dashboard",
      icon: <DashboardIcon classname="icon-color" />,
      subNav: [
        {
          subname: "",
          link: "/",
        },
      ],
    },
    {
      name: "Category",
      icon: <ProductIcon classname="icon-color" />,
      subNav: [
        {
          subname: "All Category",
          link: "/all-category",
        },
        {
          subname: "Add Category",
          link: "/add-category",
        },
      ],
    },
    {
      name: "Product",
      icon: <ProductIcon classname="icon-color" />,
      subNav: [
        {
          subname: "All Product",
          link: "/all-product",
        },
        {
          subname: "Add Product",
          link: "/add-product",
        },
      ],
    },
    {
      name: "Order",
      icon: <OrderIcon classname="icon-color" />,
      subNav: [
        {
          subname: "All Order",
          link: "/all-order",
        },
      ],
    },
  ];
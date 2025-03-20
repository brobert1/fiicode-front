import { Link } from "@components";
import { classnames } from "@lib";
import { useRouter } from "next/router";

const MenuItem = ({ href, children, level = 1, className }) => {
  const router = useRouter();
  const { pathname } = router;

  return (
    <Link
      href={href}
      className={classnames(
        "menu-item cursor-pointer px-2 py-2",
        "text-gray-900 no-underline",
        level == 1 ? "pl-6" : "pl-12",
        pathname === href && "font-semibold text-primary",
        className
      )}
    >
      {children}
    </Link>
  );
};

export default MenuItem;

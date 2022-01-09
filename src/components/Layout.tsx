import React from "react";
import { NavBar } from "./NavBar";
import { Wrapper } from "./wrapper";

interface LayoutProps {
  variant?: "small" | "regular";
  postsViewButton?: "allPosts" | "myPosts"
}

export const Layout: React.FC<LayoutProps> = ({ children, variant, postsViewButton }) => {
  return (
    <>
      <NavBar postsViewButton={postsViewButton} />
      <Wrapper variant={variant}>{children}</Wrapper>
    </>
  );
};

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";

import "./index.css";

import Layout from "@/components/Layout";
import { ArticleProvider } from "@/contexts/ArticleContext";
import IndexPage from "@/pages/IndexPage";
import ReadPage from "@/pages/ReadPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ArticleProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/read" element={<ReadPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ArticleProvider>
  </StrictMode>
);

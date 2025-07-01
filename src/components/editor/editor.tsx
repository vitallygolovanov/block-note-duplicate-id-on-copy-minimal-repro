"use client";
 
import dynamic from "next/dynamic";
export const Editor = dynamic(() => import("./_editor").then((mod) => mod.I_Editor), { ssr: false });
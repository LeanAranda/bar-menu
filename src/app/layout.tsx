import type { Metadata } from "next";
import { Geom, Slabo_27px } from "next/font/google";
import "./globals.css";

const geom = Geom({
	variable: "--font-geom",
	subsets: ["latin"],
});

const slabo = Slabo_27px({
	weight: "400",
	variable: "--font-slabo",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Bar Menu",
	description: "Descubrí nuestra propuesta gastronómica",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<link rel="icon" href="/logos/logo-icon.ico" type="image/svg+xml"></link>
			</head>
			<body className={`${geom.variable} ${slabo.variable} antialiased`}>{children}</body>
		</html>
	);
}

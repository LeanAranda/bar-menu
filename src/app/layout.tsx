import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geom = localFont({
	src: "../../public/fonts/Geom-VariableFont_wght.ttf",
	variable: "--font-geom",
});

const slabo = localFont({
	src: "../../public/fonts/Slabo13px-Regular.ttf",
	variable: "--font-slabo",
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

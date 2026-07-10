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
	description: "Bienvenido a Bar Menu. Descubrí nuestras ofertas y seguinos en nuestras redes.",
	icons: { icon: "/logos/logo-icon.ico" },
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="es">
			<body className={`${geom.variable} ${slabo.variable} antialiased`}>{children}</body>
		</html>
	);
}

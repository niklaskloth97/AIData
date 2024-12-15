import React from 'react';

export default function Footer() {
    return (  
    <footer className="bg-gray-800 text-gray-300 py-10 px-5">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        {/* Contact Info Section */}
        <div className="space-y-4 text-center md:text-left">
            <div className="flex items-center space-x-3">
            <i className="fas fa-envelope text-red-600"></i>
            <span>info@ercis.org</span>
            </div>
            <div className="flex items-center space-x-3">
            <i className="fas fa-phone text-red-600"></i>
            <span>+49 251 8338100</span>
            </div>
            <div className="flex items-center space-x-3">
            <i className="fas fa-map-marker-alt text-red-600"></i>
            <span>Leonardo-Campus 3, 48149 Münster Germany</span>
            </div>
            <div className="flex items-center space-x-3">
            <i className="fas fa-shopping-cart text-red-600"></i>
            <span>Merch</span>
            </div>
            <p className="pt-4">Hello from Europe. 👋</p>
        </div>

        {/* Logo Section */}
        <div className="mt-8 md:mt-0 text-center md:text-right">
            <div className="text-red-600 text-4xl font-bold">ERCIS</div>
            <p className="text-sm mt-2">PanEuropean Research Center for Information Systems</p>
            <div className="mt-4">
            {/* Add a placeholder for a map or icon */}
            <div className="h-16 w-16 bg-gray-700 inline-block rounded-full"></div>
            </div>
        </div>
        </div>
    </footer>
    );
}
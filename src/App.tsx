import React, { useState } from 'react';
import { Motorcycle } from 'lucide-react';

function App() {
  const [selectedTickets, setSelectedTickets] = useState<number[]>([]);
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="min-h-screen bg-[#610b10]">
      {/* Navbar */}
      <nav className="bg-white border-t-8 border-b-8 border-[#c5010e] fixed w-full top-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between h-24">
          <div className="flex items-center">
            <img 
              src="https://rifarito.s3.amazonaws.com/uploads/client/logo/2334/llgLOGO1-min.png" 
              alt="MotoMoto Rifas"
              className="h-20 w-auto"
            />
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <NavLink text="INICIO" icon="home" />
            <NavLink text="VERIFICADOR" icon="check-circle" />
            <NavLink text="CONTACTO" icon="message-circle" />
            <button className="bg-[#c5010e] text-white px-6 py-2 rounded-md hover:bg-[#f8cc13] transition-colors">
              LISTA DE BOLETOS
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-16 px-4">
        <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="bg-[#f8cc13] absolute -inset-1 rounded-lg blur-md"></div>
            <img 
              src="https://rifarito.s3.amazonaws.com/uploads/raffle/image/3046/bnrrpost-ig.jpg"
              alt="SBR 6G 2025"
              className="relative rounded-lg w-full object-cover"
            />
          </div>
          <div className="text-white">
            <div className="flex items-center gap-4 text-lg mb-4">
              <span>24 FEB 2025</span>
              <span>08:00 PM</span>
            </div>
            <h1 className="text-4xl font-bold mb-6">GANATE UNA SBR 6G 2025 0KM</h1>
            <div className="space-y-2 text-lg">
              <p>PARTICIPA Y GANATE UNA SBR 6G 2025 0KM POR TAN SOLO 1.5$ CADA TICKET Y LO MEJOR DE TODO A TASA BCV.</p>
              <p className="font-bold">PREMIOS:</p>
              <ul className="list-none space-y-2">
                <li>🥇 1ER LUGAR: SBR 6G 0KM 2025 🏍️</li>
                <li>🥈 2DO LUGAR: 50$ 💴</li>
                <li>🥉 3ER LUGAR: 2 CAMBIOS DE ACEITE PARA MOTO 150 CC</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Selection */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-bold text-center text-[#73141c] mb-8">
              LISTA DE BOLETOS
            </h2>
            
            {/* Ticket Quantity Selector */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-full bg-[#c5010e] text-white flex items-center justify-center hover:bg-[#f8cc13] transition-colors"
              >
                -
              </button>
              <div className="text-xl font-bold">
                {quantity} BOLETO{quantity > 1 ? 'S' : ''}
              </div>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-full bg-[#c5010e] text-white flex items-center justify-center hover:bg-[#f8cc13] transition-colors"
              >
                +
              </button>
            </div>

            {/* Ticket Grid */}
            <div className="grid grid-cols-10 gap-1 mb-8">
              {Array.from({length: 100}, (_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (selectedTickets.includes(i)) {
                      setSelectedTickets(selectedTickets.filter(t => t !== i));
                    } else if (selectedTickets.length < quantity) {
                      setSelectedTickets([...selectedTickets, i]);
                    }
                  }}
                  className={`aspect-square rounded-sm text-sm font-medium flex items-center justify-center
                    ${selectedTickets.includes(i) 
                      ? 'bg-[#c5010e] text-white' 
                      : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                >
                  {String(i).padStart(3, '0')}
                </button>
              ))}
            </div>

            {/* Personal Data Form */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-[#73141c]">
                <i className="fas fa-user mr-2"></i> DATOS PERSONALES
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombres y Apellidos *
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#c5010e] focus:ring focus:ring-[#c5010e] focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Celular *
                  </label>
                  <div className="flex gap-2">
                    <select className="rounded-md border-gray-300 shadow-sm focus:border-[#c5010e] focus:ring focus:ring-[#c5010e] focus:ring-opacity-50">
                      <option value="+58">🇻🇪 +58</option>
                    </select>
                    <input
                      type="tel"
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-[#c5010e] focus:ring focus:ring-[#c5010e] focus:ring-opacity-50"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-[#73141c] mb-4">
                <i className="fas fa-bank mr-2"></i> MODOS DE PAGO
              </h3>
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-4">
                  <img 
                    src="https://rifarito.s3.amazonaws.com/uploads/bank/logo/54/vepagomovilc2c.png"
                    alt="Pago Móvil BDV"
                    className="h-12 w-auto"
                  />
                  <div>
                    <p className="font-medium">KATIUSKA MIRELES</p>
                    <p className="text-sm text-gray-600">0412 9753098</p>
                    <p className="text-sm text-gray-600">CI: 14755978</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 text-center">
              <button className="bg-[#c5010e] text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-[#f8cc13] transition-colors">
                Confirmar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavLink({ text, icon }: { text: string; icon: string }) {
  return (
    <a href="#" className="flex flex-col items-center group">
      <span className="text-[#73141c] group-hover:text-[#c5010e] text-sm">Home</span>
      <span className="text-gray-600 group-hover:text-[#73141c]">
        <i className={`fas fa-${icon}`}></i> {text}
      </span>
    </a>
  );
}

export default App;
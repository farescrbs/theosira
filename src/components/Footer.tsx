import { Facebook, Instagram, Linkedin, Youtube, Mail, Phone, MapPin, Send } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";

export function Footer() {
  return (
    <footer className="bg-black text-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #d4af37 1px, transparent 0)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Gold top border */}
      <div className="h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"></div>

      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative group mb-8">
              <div className="tracking-[0.35em] text-white mb-2">
                THESORIA
              </div>
              <div className="w-20 h-px bg-gradient-to-r from-[#d4af37] to-transparent"></div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Leader mondial dans le développement de solutions blockchain premium 
              et innovantes depuis 2020.
            </p>
            
            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-sm text-gray-400 mb-3 tracking-wide">NEWSLETTER</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Votre email"
                  className="flex-1 bg-white/5 border border-white/10 px-4 py-2.5 text-sm focus:border-[#d4af37] focus:outline-none transition-colors"
                />
                <button className="bg-gradient-to-r from-[#d4af37] to-[#f0e68c] p-2.5 hover:shadow-lg hover:shadow-[#d4af37]/30 transition-all">
                  <Send size={18} className="text-black" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="mb-6 tracking-[0.2em] text-white relative inline-block">
              NAVIGATION
              <div className="absolute -bottom-2 left-0 w-12 h-px bg-[#d4af37]"></div>
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Marchés", to: "/markets" },
                { label: "DeFi", to: "/defi" },
                { label: "Wallet", to: "/wallet" },
                { label: "NFT", to: "/nft" },
                { label: "Trading", to: "/trading" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-gray-400 hover:text-[#d4af37] transition-colors text-sm flex items-center group"
                  >
                    <span className="w-0 h-px bg-[#d4af37] mr-0 group-hover:w-4 group-hover:mr-2 transition-all duration-300"></span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="mb-6 tracking-[0.2em] text-white relative inline-block">
              SERVICES
              <div className="absolute -bottom-2 left-0 w-12 h-px bg-[#d4af37]"></div>
            </h4>
            <ul className="space-y-3">
              {[
                { label: "MEV & God Mode", to: "/mev" },
                { label: "Intelligence IA", to: "/ai" },
                { label: "Services", to: "/services" },
                { label: "Support", to: "#" },
                { label: "Audit de sécurité", to: "#" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-gray-400 hover:text-[#d4af37] transition-colors text-sm flex items-center group"
                  >
                    <span className="w-0 h-px bg-[#d4af37] mr-0 group-hover:w-4 group-hover:mr-2 transition-all duration-300"></span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="mb-6 tracking-[0.2em] text-white relative inline-block">
              CONTACT
              <div className="absolute -bottom-2 left-0 w-12 h-px bg-[#d4af37]"></div>
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start text-gray-400 text-sm group">
                <MapPin size={16} className="mr-3 mt-1 flex-shrink-0 text-[#d4af37]" />
                <span className="group-hover:text-white transition-colors">
                  123 Avenue de la Blockchain<br />75008 Paris, France
                </span>
              </li>
              <li className="flex items-center text-gray-400 text-sm group">
                <Phone size={16} className="mr-3 flex-shrink-0 text-[#d4af37]" />
                <span className="group-hover:text-white transition-colors">+33 1 23 45 67 89</span>
              </li>
              <li className="flex items-center text-gray-400 text-sm group">
                <Mail size={16} className="mr-3 flex-shrink-0 text-[#d4af37]" />
                <span className="group-hover:text-white transition-colors">contact@thesoria.com</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8"></div>

        {/* Social Media & Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row justify-between items-center gap-6"
        >
          {/* Social Icons */}
          <div className="flex items-center space-x-4">
            {[
              { Icon: Facebook, href: "#" },
              { Icon: Instagram, href: "#" },
              { Icon: Linkedin, href: "#" },
              { Icon: Youtube, href: "#" },
            ].map(({ Icon, href }, index) => (
              <motion.a
                key={index}
                href={href}
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 border border-white/20 hover:border-[#d4af37] flex items-center justify-center text-gray-400 hover:text-[#d4af37] transition-all relative group"
              >
                <Icon size={18} />
                <div className="absolute inset-0 bg-[#d4af37]/10 scale-0 group-hover:scale-100 transition-transform"></div>
              </motion.a>
            ))}
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            {["Mentions légales", "Politique de confidentialité", "CGV", "Cookies"].map((link) => (
              <a key={link} href="#" className="hover:text-[#d4af37] transition-colors relative group">
                {link}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#d4af37] group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mt-8 pt-8 border-t border-white/5"
        >
          <p className="text-gray-500 text-sm">
            © 2025 THESORIA. Tous droits réservés.
            <span className="mx-3 text-[#d4af37]">•</span>
            Made with <span className="text-[#d4af37]">♦</span> in Paris
          </p>
        </motion.div>
      </div>
    </footer>
  );
}

export default Footer;
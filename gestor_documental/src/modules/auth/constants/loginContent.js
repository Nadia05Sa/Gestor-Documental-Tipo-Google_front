import { Cloud, FileText, FolderOpen } from 'lucide-react';

export const LOGIN_PROMO = {
  title: 'Tu almacenamiento seguro en la nube',
  description: 'Gestiona, comparte y colabora en tus documentos desde cualquier lugar del mundo.',
  features: [
    {
      icon: Cloud,
      title: 'Almacenamiento seguro',
      description: 'Archivos protegidos con encriptación AES-256 de extremo a extremo.',
    },
    {
      icon: FolderOpen,
      title: 'Organización inteligente',
      description: 'Carpetas, etiquetas y búsqueda avanzada para encontrar todo al instante.',
    },
    {
      icon: FileText,
      title: 'Colaboración en tiempo real',
      description: 'Edita y comparte documentos con tu equipo sin fricciones.',
    },
  ],
};

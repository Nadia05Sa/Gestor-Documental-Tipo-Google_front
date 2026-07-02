import type { LucideIcon } from 'lucide-react';
import {
  Cloud,
  FolderOpen,
  HardDrive,
  Lock,
  Search,
  Share2,
  Shield,
  Users,
} from 'lucide-react';

export type LandingFeatureItem = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export type LandingStatItem = {
  icon: LucideIcon;
  value: string;
  label: string;
  offset: string;
};

export const LANDING_HERO = {
  badge: 'ALMACENAMIENTO EN LA NUBE',
  titlePrefix: 'Tus archivos, seguros y accesibles en',
  titleHighlight: 'segundos',
  description:
    'Infinity Vault te permite gestionar, compartir y colaborar en tus documentos desde cualquier lugar. Olvídate del caos de archivos dispersos y recupera el control de tu información.',
  imageUrl:
    'https://images.unsplash.com/photo-1618040996337-56904b7850b9?auto=format&fit=crop&w=1200&q=80',
  imageAlt: 'Interfaz moderna de gestión documental en la nube',
};

export const LANDING_FEATURES = {
  title: 'Diseñado para tu productividad',
  description:
    'Una plataforma completa que combina seguridad, organización y colaboración en una experiencia simple e intuitiva.',
  items: [
    {
      icon: Cloud,
      title: 'Almacenamiento seguro',
      description: 'Archivos protegidos con encriptación AES-256 de extremo a extremo en la nube.',
    },
    {
      icon: FolderOpen,
      title: 'Organización inteligente',
      description: 'Carpetas, etiquetas y vistas personalizadas para encontrar todo al instante.',
    },
    {
      icon: Share2,
      title: 'Compartir sin fricciones',
      description: 'Enlaces seguros, permisos granulares y colaboración en tiempo real.',
    },
    {
      icon: Search,
      title: 'Búsqueda avanzada',
      description: 'Localiza documentos por nombre, tipo, fecha o contenido en segundos.',
    },
    {
      icon: HardDrive,
      title: 'Sincronización automática',
      description: 'Tus archivos siempre actualizados en todos tus dispositivos conectados.',
    },
    {
      icon: Shield,
      title: 'Seguro y confiable',
      description: 'Respaldo en la nube, control de acceso y auditoría de actividad.',
    },
  ] as LandingFeatureItem[],
};

export const LANDING_BENEFITS = {
  title: 'Potencia tu gestión documental',
  items: [
    {
      title: 'Acceso desde cualquier lugar',
      description: 'Consulta y gestiona tus documentos desde web, móvil o escritorio.',
    },
    {
      title: 'Control de permisos',
      description: 'Define quién puede ver, editar o compartir cada carpeta y archivo.',
    },
    {
      title: 'Colaboración en equipo',
      description: 'Trabaja con tu equipo en documentos compartidos sin perder el control.',
    },
  ],
  stats: [
    { icon: HardDrive, value: '50k+', label: 'Archivos gestionados', offset: '' },
    { icon: Users, value: '2.4k', label: 'Usuarios activos', offset: 'md:translate-y-8' },
    { icon: Cloud, value: '99.9%', label: 'Disponibilidad', offset: 'md:-translate-y-4' },
    { icon: Lock, value: '256-bit', label: 'Encriptación', offset: 'md:translate-y-4' },
  ] as LandingStatItem[],
};

export const LANDING_CTA = {
  title: '¿Listo para proteger y organizar tus documentos?',
  description:
    'Únete a miles de usuarios que ya confían en Infinity Vault para gestionar su información de forma segura y eficiente.',
};

export const LANDING_FOOTER_LINKS = ['Contacto', 'Privacidad', 'Términos', 'Ayuda'];

export type LandingCtaSectionProps = {
  onRegister: () => void;
  isBusy: boolean;
  isRegisterLoading: boolean;
};

export type LandingHeroSectionProps = LandingCtaSectionProps & {
  onLogin: () => void;
  isLoginLoading: boolean;
};

export type SectionHeadingProps = {
  title: string;
  description?: string;
  className?: string;
};

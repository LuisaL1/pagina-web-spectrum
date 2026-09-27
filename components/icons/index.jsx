/*
  Sistema de iconos de Spectrum, basado en Bootstrap Icons (MIT). Cada
  componente conserva su nombre y su API (`size` y props de <svg>); los
  trazados viven en bootstrap-icons.jsx. Para usar cualquier otro icono de
  la libreria: <BsIcon name="nombre" />.
*/

import { bootstrapIcons } from "./bootstrap-icons";

export function BsIcon({ name, size = 18, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {bootstrapIcons[name]}
    </svg>
  );
}

export function SearchIcon(props) {
  return <BsIcon name="search" {...props} />;
}

export function MenuIcon(props) {
  return <BsIcon name="list" {...props} />;
}

export function CloseIcon(props) {
  return <BsIcon name="x-lg" {...props} />;
}

export function CaretIcon(props) {
  return <BsIcon name="chevron-down" {...props} />;
}

export function ArrowRightIcon(props) {
  return <BsIcon name="arrow-right" {...props} />;
}

export function CheckIcon(props) {
  return <BsIcon name="check2" {...props} />;
}

export function ChatIcon(props) {
  return <BsIcon name="chat-dots" {...props} />;
}

export function SendIcon(props) {
  return <BsIcon name="send" {...props} />;
}

export function WhatsAppIcon(props) {
  return <BsIcon name="whatsapp" {...props} />;
}

export function LinkedInIcon(props) {
  return <BsIcon name="linkedin" {...props} />;
}

export function InstagramIcon(props) {
  return <BsIcon name="instagram" {...props} />;
}

export function FacebookIcon(props) {
  return <BsIcon name="facebook" {...props} />;
}

export function StackIcon(props) {
  return <BsIcon name="layers" {...props} />;
}

export function BroadcastIcon(props) {
  return <BsIcon name="broadcast" {...props} />;
}

export function CloudIcon(props) {
  return <BsIcon name="cloud" {...props} />;
}

export function ShieldCheckIcon(props) {
  return <BsIcon name="shield-check" {...props} />;
}

export function ShieldClockIcon(props) {
  return <BsIcon name="clock-history" {...props} />;
}

export function BugIcon(props) {
  return <BsIcon name="bug" {...props} />;
}

export function CodeLockIcon(props) {
  return <BsIcon name="file-earmark-lock2" {...props} />;
}

export function AuditIcon(props) {
  return <BsIcon name="clipboard-check" {...props} />;
}

export function NodesIcon(props) {
  return <BsIcon name="diagram-3" {...props} />;
}

export function BuildingIcon(props) {
  return <BsIcon name="buildings" {...props} />;
}

export function ServerRackIcon(props) {
  return <BsIcon name="hdd-rack" {...props} />;
}

export function LockIcon(props) {
  return <BsIcon name="lock" {...props} />;
}

export function RenewIcon(props) {
  return <BsIcon name="arrow-repeat" {...props} />;
}

export function HeadsetIcon(props) {
  return <BsIcon name="headset" {...props} />;
}

export function CompassIcon(props) {
  return <BsIcon name="compass" {...props} />;
}

export function WrenchIcon(props) {
  return <BsIcon name="wrench-adjustable" {...props} />;
}

export function GearIcon(props) {
  return <BsIcon name="gear" {...props} />;
}

export function TrendIcon(props) {
  return <BsIcon name="graph-up-arrow" {...props} />;
}

export function ChipShieldIcon(props) {
  return <BsIcon name="cpu" {...props} />;
}

export function ChipIcon(props) {
  return <BsIcon name="cpu" {...props} />;
}

export function ClockIcon(props) {
  return <BsIcon name="clock" {...props} />;
}

export function UsersIcon(props) {
  return <BsIcon name="people" {...props} />;
}

export function CodeIcon(props) {
  return <BsIcon name="code-slash" {...props} />;
}

export function PlugIcon(props) {
  return <BsIcon name="plug" {...props} />;
}

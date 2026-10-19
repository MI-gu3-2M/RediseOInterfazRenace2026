import { useMemo, useState } from "react"
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BadgeDollarSign,
  BarChart3,
  Bell,
  Box,
  CalendarClock,
  Check,
  ChevronDown,
  CircleDollarSign,
  ClipboardList,
  Clock3,
  CreditCard,
  DoorOpen,
  Dumbbell,
  Eye,
  EyeOff,
  Fingerprint,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  Mail,
  Menu,
  PackagePlus,
  Plus,
  ReceiptText,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  ShoppingCart,
  SlidersHorizontal,
  TrendingUp,
  UserCog,
  UserPlus,
  Users,
  WalletCards,
  X,
  type LucideIcon,
} from "lucide-react"

type PageId = "dashboard" | "socios" | "membresias" | "recepcion" | "ventas" | "inventario" | "empleados" | "usuarios" | "reportes" | "configuracion"

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger"
type BadgeTone = "success" | "warning" | "danger" | "info" | "neutral"

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ")

function Button({
  children,
  icon: Icon,
  variant = "primary",
  className,
  type = "button",
  disabled,
  onClick,
}: {
  children: React.ReactNode
  icon?: LucideIcon
  variant?: ButtonVariant
  className?: string
  type?: "button" | "submit"
  disabled?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cx("btn", `btn-${variant}`, className)}
    >
      {Icon && <Icon size={17} strokeWidth={2} />}
      {children}
    </button>
  )
}

function IconButton({
  label,
  icon: Icon,
  onClick,
  active,
}: {
  label: string
  icon: LucideIcon
  onClick?: () => void
  active?: boolean
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cx("icon-btn", active && "icon-btn-active")}
    >
      <Icon size={19} />
    </button>
  )
}

function Field({
  label,
  icon: Icon,
  type = "text",
  value,
  placeholder,
  onChange,
  right,
}: {
  label?: string
  icon?: LucideIcon
  type?: string
  value?: string
  placeholder?: string
  onChange?: (value: string) => void
  right?: React.ReactNode
}) {
  return (
    <label className="field">
      {label && <span className="field-label">{label}</span>}
      <span className="field-shell">
        {Icon && <Icon className="field-icon" size={17} />}
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange?.(event.target.value)}
        />
        {right}
      </span>
    </label>
  )
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label?: string
  value: string
  options: string[]
  onChange?: (value: string) => void
}) {
  return (
    <label className="field">
      {label && <span className="field-label">{label}</span>}
      <span className="field-shell">
        <select
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
        >
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <ChevronDown className="select-icon" size={16} />
      </span>
    </label>
  )
}

function StatusBadge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode
  tone?: BadgeTone
}) {
  return (
    <span className={cx("status-badge", `status-${tone}`)}>
      <span className="status-dot" />
      {children}
    </span>
  )
}

function Panel({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <section className={cx("panel", className)}>{children}</section>
}

function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: string
  action?: React.ReactNode
}) {
  return (
    <div className="section-header">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

function StatCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = "blue",
  trend,
}: {
  label: string
  value: string
  detail: string
  icon: LucideIcon
  tone?: "blue" | "green" | "amber" | "violet"
  trend?: string
}) {
  return (
    <Panel className="stat-card">
      <div className={cx("stat-icon", `stat-${tone}`)}>
        <Icon size={20} />
      </div>
      <div className="stat-copy">
        <span>{label}</span>
        <strong>{value}</strong>
        <small>
          {trend && <b>{trend}</b>} {detail}
        </small>
      </div>
    </Panel>
  )
}

type Column<T,> = {
  key: keyof T
  label: string
  render?: (row: T) => React.ReactNode
  align?: "left" | "right"
}

function DataTable<T extends { id: string | number }>({
  columns,
  rows,
  emptyTitle = "Sin resultados",
  emptyCopy = "Prueba con otros filtros o registra un nuevo elemento.",
}: {
  columns: Column<T>[]
  rows: T[]
  emptyTitle?: string
  emptyCopy?: string
}) {
  if (!rows.length) {
    return (
      <div className="empty-state">
        <Search size={28} />
        <strong>{emptyTitle}</strong>
        <span>{emptyCopy}</span>
      </div>
    )
  }
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={column.align === "right" ? "align-right" : ""}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {columns.map((column) => (
                <td
                  key={String(column.key)}
                  className={column.align === "right" ? "align-right" : ""}
                >
                  {column.render ? column.render(row) : String(row[column.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Modal({
  title,
  subtitle,
  children,
  confirmLabel = "Guardar cambios",
  onClose,
  onConfirm,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
  confirmLabel?: string
  onClose: () => void
  onConfirm?: () => void
}) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <IconButton label="Cerrar" icon={X} onClick={onClose} />
        </div>
        <div className="modal-body">{children}</div>
        <div className="modal-footer">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          {onConfirm && (
            <Button icon={Check} onClick={onConfirm}>
              {confirmLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean
  onChange: () => void
  label: string
  description?: string
}) {
  return (
    <button type="button" className="toggle-row" onClick={onChange}>
      <span>
        <strong>{label}</strong>
        {description && <small>{description}</small>}
      </span>
      <span className={cx("toggle", checked && "toggle-on")}>
        <span />
      </span>
    </button>
  )
}

const navItems: Array<{
  id: PageId
  label: string
  icon: LucideIcon
  section?: string
}> = [
  {
    id: "dashboard",
    label: "Resumen",
    icon: LayoutDashboard,
    section: "Operación",
  },
  { id: "socios", label: "Socios", icon: Users },
  { id: "membresias", label: "Membresías", icon: CreditCard },
  { id: "recepcion", label: "Recepción y acceso", icon: DoorOpen },
  {
    id: "ventas",
    label: "Ventas y caja",
    icon: ShoppingCart,
    section: "Administración",
  },
  { id: "inventario", label: "Inventario", icon: Box },
  { id: "empleados", label: "Empleados", icon: UserCog },
  { id: "usuarios", label: "Usuarios y permisos", icon: ShieldCheck },
  { id: "reportes", label: "Reportes", icon: BarChart3, section: "Sistema" },
  { id: "configuracion", label: "Configuración", icon: Settings },
]

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={cx("brand", compact && "brand-compact")}>
      <span className="brand-mark">
        <span />
        <span />
        <span />
      </span>
      {!compact && (
        <span className="brand-copy">
          <strong>VÉRTIKA</strong>
          <small>GESTIÓN DEPORTIVA</small>
        </span>
      )}
    </div>
  )
}

function Login({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("admin@vertika.demo")
  const [password, setPassword] = useState("demostracion")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!email || !password) {
      setError("Completa el correo y la contraseña para continuar.")
      return
    }
    setError("")
    setLoading(true)
    window.setTimeout(onLogin, 650)
  }

  return (
    <main className="login-page">
      <div className="login-ambient login-ambient-one" />
      <div className="login-ambient login-ambient-two" />
      <section className="login-story">
        <Logo />
        <div className="login-message">
          <span className="eyebrow">
            <Activity size={15} /> OPERACIÓN EN MOVIMIENTO
          </span>
          <h1>
            Control preciso.
            <br />
            Decisiones más fuertes.
          </h1>
          <p>
            Una nueva referencia visual para administrar socios, accesos y
            operación diaria desde un solo lugar.
          </p>
        </div>
        <div className="login-metrics">
          <div>
            <strong>10</strong>
            <span>módulos conectados</span>
          </div>
          <div>
            <strong>24/7</strong>
            <span>visión operativa</span>
          </div>
          <div>
            <strong>1</strong>
            <span>experiencia unificada</span>
          </div>
        </div>
      </section>
      <section className="login-panel">
        <form className="login-card" onSubmit={submit}>
          <div className="mobile-logo">
            <Logo />
          </div>
          <span className="demo-pill">
            PROTOTIPO VISUAL · DATOS DE DEMOSTRACIÓN
          </span>
          <div className="login-title">
            <h2>Bienvenido de nuevo</h2>
            <p>Accede al centro de operaciones de VÉRTIKA.</p>
          </div>
          <Field
            label="Correo electrónico"
            icon={Mail}
            type="email"
            value={email}
            onChange={setEmail}
          />
          <Field
            label="Contraseña"
            icon={LockKeyhole}
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={setPassword}
            right={
              <button
                type="button"
                className="field-action"
                aria-label="Mostrar contraseña"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            }
          />
          <div className="login-options">
            <label className="checkbox">
              <input type="checkbox" defaultChecked />{" "}
              <span>Recordar sesión</span>
            </label>
            <button type="button" className="text-button">
              ¿Olvidaste tu contraseña?
            </button>
          </div>
          {error && (
            <div className="form-error">
              <AlertTriangle size={16} />
              {error}
            </div>
          )}
          <Button type="submit" className="login-submit" disabled={loading}>
            {loading ? (
              <>
                <RefreshCw className="spin" size={17} /> Preparando espacio...
              </>
            ) : (
              <>
                Ingresar al sistema <ArrowRight size={17} />
              </>
            )}
          </Button>
          <div className="connection-state">
            <span />
            <strong>Entorno de demostración disponible</strong>
          </div>
          <p className="login-footnote">
            Este prototipo no realiza autenticación real ni se conecta a
            servicios externos.
          </p>
        </form>
      </section>
    </main>
  )
}

function Sidebar({
  page,
  onNavigate,
  collapsed,
  onCollapse,
}: {
  page: PageId
  onNavigate: (page: PageId) => void
  collapsed: boolean
  onCollapse: () => void
}) {
  return (
    <aside className={cx("sidebar", collapsed && "sidebar-collapsed")}>
      <div className="sidebar-top">
        <Logo compact={collapsed} />
        <IconButton label="Contraer menú" icon={Menu} onClick={onCollapse} />
      </div>
      <nav>
        {navItems.map((item) => (
          <div key={item.id}>
            {item.section && !collapsed && (
              <span className="nav-section">{item.section}</span>
            )}
            <button
              type="button"
              className={cx("nav-item", page === item.id && "nav-item-active")}
              onClick={() => onNavigate(item.id)}
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={19} />
              {!collapsed && <span>{item.label}</span>}
              {item.id === "recepcion" && !collapsed && (
                <b className="nav-live">EN VIVO</b>
              )}
            </button>
          </div>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="system-health">
          <span className="health-icon">
            <Activity size={17} />
          </span>
          {!collapsed && (
            <span>
              <strong>Sistema estable</strong>
              <small>Prototipo visual</small>
            </span>
          )}
        </div>
      </div>
    </aside>
  )
}

function Topbar({
  page,
  onNavigate,
  onLogout,
}: {
  page: PageId
  onNavigate: (page: PageId) => void
  onLogout: () => void
}) {
  const [search, setSearch] = useState("")
  const [notifications, setNotifications] = useState(false)
  const [profile, setProfile] = useState(false)
  const title = navItems.find((item) => item.id === page)?.label
  const results = navItems.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <header className="topbar">
      <div className="topbar-title">
        <span>VÉRTIKA / {page === "dashboard" ? "OPERACIÓN" : "MÓDULOS"}</span>
        <h1>{title}</h1>
      </div>
      <div className="topbar-actions">
        <div className="global-search">
          <Search size={17} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar módulo o acción..."
          />
          <kbd>⌘ K</kbd>
          {search && (
            <div className="search-results">
              <small>RESULTADOS</small>
              {results.length ? (
                results.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onNavigate(item.id)
                      setSearch("")
                    }}
                  >
                    <item.icon size={17} />
                    <span>{item.label}</span>
                    <ArrowRight size={15} />
                  </button>
                ))
              ) : (
                <p>No encontramos coincidencias.</p>
              )}
            </div>
          )}
        </div>
        <div className="popover-anchor">
          <IconButton
            label="Notificaciones"
            icon={Bell}
            active={notifications}
            onClick={() => setNotifications(!notifications)}
          />
          <span className="notification-dot" />
          {notifications && (
            <div className="popover notification-popover">
              <div className="popover-title">
                <strong>Notificaciones</strong>
                <span>3 nuevas</span>
              </div>
              <div className="notification-item">
                <span className="notif warning">
                  <CalendarClock size={17} />
                </span>
                <div>
                  <strong>12 membresías por vencer</strong>
                  <p>En los próximos 7 días · demo</p>
                </div>
              </div>
              <div className="notification-item">
                <span className="notif danger">
                  <Box size={17} />
                </span>
                <div>
                  <strong>Stock bajo en 3 productos</strong>
                  <p>Requieren reposición · demo</p>
                </div>
              </div>
              <div className="notification-item">
                <span className="notif success">
                  <Check size={17} />
                </span>
                <div>
                  <strong>Cierre de caja completado</strong>
                  <p>Turno matutino · demo</p>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="topbar-divider" />
        <div className="popover-anchor">
          <button
            type="button"
            className="profile-button"
            onClick={() => setProfile(!profile)}
          >
            <span className="avatar">LM</span>
            <span className="profile-copy">
              <strong>Laura Méndez</strong>
              <small>Superadministradora</small>
            </span>
            <ChevronDown size={16} />
          </button>
          {profile && (
            <div className="popover profile-popover">
              <button type="button" onClick={() => onNavigate("configuracion")}>
                <Settings size={17} />
                Configuración
              </button>
              <button type="button" onClick={onLogout}>
                <LogOut size={17} />
                Cerrar sesión demo
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

const membersSeed = [
  {
    id: 1,
    name: "Mariana Torres",
    code: "VTK-02418",
    plan: "Integral Plus",
    expires: "18 mar 2026",
    visits: "22 este mes",
    status: "Activa",
  },
  {
    id: 2,
    name: "Santiago Ruiz",
    code: "VTK-02391",
    plan: "Fitness",
    expires: "12 mar 2026",
    visits: "15 este mes",
    status: "Por vencer",
  },
  {
    id: 3,
    name: "Valeria Campos",
    code: "VTK-02274",
    plan: "Integral Plus",
    expires: "28 abr 2026",
    visits: "18 este mes",
    status: "Activa",
  },
  {
    id: 4,
    name: "Diego Salazar",
    code: "VTK-02155",
    plan: "Básica",
    expires: "05 mar 2026",
    visits: "8 este mes",
    status: "Vencida",
  },
  {
    id: 5,
    name: "Renata Vargas",
    code: "VTK-02098",
    plan: "Fitness",
    expires: "23 mar 2026",
    visits: "11 este mes",
    status: "Congelada",
  },
]

function PageIntro({
  eyebrow,
  title,
  copy,
  action,
}: {
  eyebrow: string
  title: string
  copy: string
  action?: React.ReactNode
}) {
  return (
    <div className="page-intro">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        <p>{copy}</p>
      </div>
      {action}
    </div>
  )
}

function Dashboard() {
  const bars = [48, 64, 55, 78, 70, 88, 76, 92, 81, 98, 86, 104]
  return (
    <div className="page-content">
      <div className="demo-banner">
        <span>DEMO</span> Información ficticia para validar el diseño y la
        experiencia de navegación.
      </div>
      <PageIntro
        eyebrow="MIÉRCOLES, 11 DE MARZO"
        title="Buenos días, Laura."
        copy="Este es el pulso operativo de tu gimnasio hoy."
        action={
          <Button icon={ClipboardList} variant="secondary">
            Ver corte del día
          </Button>
        }
      />
      <div className="stats-grid">
        <StatCard
          label="Socios activos"
          value="1,248"
          detail="vs. mes anterior"
          trend="+8.2%"
          icon={Users}
          tone="blue"
        />
        <StatCard
          label="Ingresos del mes"
          value="$384,920"
          detail="objetivo al 82%"
          trend="+12.4%"
          icon={CircleDollarSign}
          tone="green"
        />
        <StatCard
          label="Accesos hoy"
          value="186"
          detail="pico entre 18–20 h"
          trend="+5.7%"
          icon={DoorOpen}
          tone="violet"
        />
        <StatCard
          label="Por vencer"
          value="32"
          detail="próximos 7 días"
          icon={CalendarClock}
          tone="amber"
        />
      </div>
      <div className="dashboard-grid">
        <Panel className="revenue-panel">
          <SectionHeader
            title="Rendimiento de ingresos"
            subtitle="Comparativa mensual · datos demo"
            action={
              <SelectField
                value="Últimos 12 meses"
                options={[
                  "Últimos 12 meses",
                  "Últimos 6 meses",
                  "Este trimestre",
                ]}
              />
            }
          />
          <div className="chart-head">
            <strong>$384,920</strong>
            <span>
              <TrendingUp size={15} /> 12.4% este mes
            </span>
          </div>
          <div className="bar-chart">
            {bars.map((height, index) => (
              <span
                key={index}
                style={{ height }}
                className={index === bars.length - 1 ? "active" : ""}
              />
            ))}
          </div>
          <div className="chart-labels">
            {[
              "Abr",
              "May",
              "Jun",
              "Jul",
              "Ago",
              "Sep",
              "Oct",
              "Nov",
              "Dic",
              "Ene",
              "Feb",
              "Mar",
            ].map((month) => (
              <span key={month}>{month}</span>
            ))}
          </div>
        </Panel>
        <Panel>
          <SectionHeader
            title="Actividad reciente"
            subtitle="Últimos movimientos · demo"
            action={
              <button type="button" className="text-button">
                Ver todo
              </button>
            }
          />
          <div className="activity-list">
            {[
              [
                DoorOpen,
                "Acceso autorizado",
                "Mariana Torres · 09:42",
                "success",
              ],
              [
                CreditCard,
                "Membresía renovada",
                "Santiago Ruiz · 09:28",
                "info",
              ],
              [
                ShoppingCart,
                "Venta registrada",
                "Folio V-1048 · 09:14",
                "violet",
              ],
              [UserPlus, "Nuevo socio", "Andrea Robles · 08:55", "warning"],
              [
                WalletCards,
                "Apertura de caja",
                "Laura Méndez · 07:02",
                "neutral",
              ],
            ].map(([Icon, title, copy, tone], index) => {
              const ActivityIcon = Icon as LucideIcon
              return (
                <div className="activity-row" key={index}>
                  <span className={cx("activity-icon", `activity-${tone}`)}>
                    <ActivityIcon size={16} />
                  </span>
                  <div>
                    <strong>{String(title)}</strong>
                    <span>{String(copy)}</span>
                  </div>
                  <small>hoy</small>
                </div>
              )
            })}
          </div>
        </Panel>
      </div>
      <div className="lower-grid">
        <Panel>
          <SectionHeader
            title="Membresías próximas a vencer"
            subtitle="Seguimiento comercial prioritario"
            action={<StatusBadge tone="warning">12 esta semana</StatusBadge>}
          />
          <DataTable
            rows={membersSeed.slice(0, 3)}
            columns={[
              {
                key: "name",
                label: "SOCIO",
                render: (row) => (
                  <div className="person-cell">
                    <span>
                      {row.name
                        .split(" ")
                        .map((v) => v[0])
                        .slice(0, 2)
                        .join("")}
                    </span>
                    <div>
                      <strong>{row.name}</strong>
                      <small>{row.code}</small>
                    </div>
                  </div>
                ),
              },
              { key: "plan", label: "PLAN" },
              { key: "expires", label: "VENCE" },
              {
                key: "status",
                label: "ESTADO",
                render: (row) => (
                  <StatusBadge
                    tone={row.status === "Activa" ? "success" : "warning"}
                  >
                    {row.status}
                  </StatusBadge>
                ),
              },
            ]}
          />
        </Panel>
        <Panel className="occupancy">
          <SectionHeader
            title="Ocupación actual"
            subtitle="Aforo estimado · demo"
          />
          <div className="occupancy-ring">
            <div>
              <strong>64%</strong>
              <span>128 de 200</span>
            </div>
          </div>
          <div className="occupancy-detail">
            <span>
              <i className="dot-blue" /> En sala <b>128</b>
            </span>
            <span>
              <i className="dot-muted" /> Disponible <b>72</b>
            </span>
          </div>
          <div className="peak-note">
            <Clock3 size={17} />
            <span>
              <strong>Próximo pico estimado: 18:00</strong>
              <small>Basado en visitas de demostración</small>
            </span>
          </div>
        </Panel>
      </div>
    </div>
  )
}

function Socios() {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("Todos")
  const [modal, setModal] = useState(false)
  const [rows, setRows] = useState(membersSeed)
  const filtered = rows.filter(
    (row) =>
      (row.name.toLowerCase().includes(search.toLowerCase()) ||
        row.code.toLowerCase().includes(search.toLowerCase())) &&
      (status === "Todos" || row.status === status),
  )
  const add = () => {
    setRows([
      ...rows,
      {
        id: rows.length + 1,
        name: "Nuevo socio demo",
        code: `VTK-0${2500 + rows.length}`,
        plan: "Fitness",
        expires: "11 abr 2026",
        visits: "Sin accesos",
        status: "Activa",
      },
    ])
    setModal(false)
  }
  return (
    <div className="page-content">
      <PageIntro
        eyebrow="GESTIÓN DE SOCIOS"
        title="Directorio de socios"
        copy="Consulta perfiles, membresías y actividad desde una vista unificada."
        action={
          <Button icon={UserPlus} onClick={() => setModal(true)}>
            Registrar socio
          </Button>
        }
      />
      <Panel>
        <div className="toolbar">
          <Field
            icon={Search}
            value={search}
            onChange={setSearch}
            placeholder="Buscar por nombre, correo o folio..."
          />
          <SelectField
            value={status}
            options={["Todos", "Activa", "Por vencer", "Vencida", "Congelada"]}
            onChange={setStatus}
          />
          <Button icon={SlidersHorizontal} variant="secondary">
            Más filtros
          </Button>
          <span className="result-count">
            {filtered.length} resultados demo
          </span>
        </div>
        <DataTable
          rows={filtered}
          columns={[
            {
              key: "name",
              label: "SOCIO",
              render: (row) => (
                <div className="person-cell">
                  <span>
                    {row.name
                      .split(" ")
                      .map((v) => v[0])
                      .slice(0, 2)
                      .join("")}
                  </span>
                  <div>
                    <strong>{row.name}</strong>
                    <small>{row.code}</small>
                  </div>
                </div>
              ),
            },
            { key: "plan", label: "MEMBRESÍA" },
            { key: "visits", label: "ACTIVIDAD" },
            { key: "expires", label: "VIGENCIA" },
            {
              key: "status",
              label: "ESTADO",
              render: (row) => (
                <StatusBadge
                  tone={
                    row.status === "Activa"
                      ? "success"
                      : row.status === "Por vencer" ||
                          row.status === "Congelada"
                        ? "warning"
                        : "danger"
                  }
                >
                  {row.status}
                </StatusBadge>
              ),
            },
            {
              key: "id",
              label: "",
              align: "right",
              render: () => <Button variant="ghost">Ver perfil</Button>,
            },
          ]}
        />
        <div className="pagination">
          <span>
            Mostrando 1–{filtered.length} de {filtered.length}
          </span>
          <div>
            <Button variant="secondary">Anterior</Button>
            <Button variant="secondary">Siguiente</Button>
          </div>
        </div>
      </Panel>
      {modal && (
        <Modal
          title="Registrar nuevo socio"
          subtitle="Formulario de demostración sin persistencia real."
          onClose={() => setModal(false)}
          onConfirm={add}
          confirmLabel="Crear socio demo"
        >
          <div className="form-grid">
            <Field label="Nombre(s)" placeholder="Ej. Fernanda" />
            <Field label="Apellidos" placeholder="Ej. Ortiz López" />
            <Field
              label="Correo electrónico"
              type="email"
              placeholder="correo@ejemplo.com"
            />
            <Field label="Teléfono" placeholder="55 0000 0000" />
            <SelectField
              label="Plan inicial"
              value="Fitness"
              options={["Fitness", "Integral Plus", "Básica"]}
            />
            <Field label="Fecha de inicio" type="date" />
          </div>
          <div className="info-callout">
            <ShieldCheck size={18} />
            <span>
              <strong>Registro de demostración</strong>
              <small>
                No se enviará información ni se crearán cargos reales.
              </small>
            </span>
          </div>
        </Modal>
      )}
    </div>
  )
}

function Membresias() {
  const [freeze, setFreeze] = useState(false)
  const plans = [
    {
      name: "Básica",
      price: "$549",
      members: "318 socios",
      features: ["Área de pesas", "Cardio", "Acceso 6:00–22:00"],
    },
    {
      name: "Fitness",
      price: "$749",
      members: "526 socios",
      features: ["Todo Básica", "Clases grupales", "Valoración mensual"],
      popular: true,
    },
    {
      name: "Integral Plus",
      price: "$999",
      members: "404 socios",
      features: ["Todo Fitness", "Acceso ilimitado", "Invitado mensual"],
    },
  ]
  return (
    <div className="page-content">
      <PageIntro
        eyebrow="MEMBRESÍAS"
        title="Planes y vigencias"
        copy="Gestiona la oferta comercial y da seguimiento a cada ciclo de membresía."
        action={<Button icon={Plus}>Crear plan</Button>}
      />
      <div className="membership-summary">
        <div>
          <span>MEMBRESÍAS ACTIVAS</span>
          <strong>1,248</strong>
          <small>
            <b>+8.2%</b> este trimestre
          </small>
        </div>
        <div>
          <span>RENOVACIÓN PROMEDIO</span>
          <strong>78%</strong>
          <small>Meta demo: 82%</small>
        </div>
        <div>
          <span>CONGELACIONES ACTIVAS</span>
          <strong>14</strong>
          <small>Dentro de política</small>
        </div>
      </div>
      <SectionHeader
        title="Planes disponibles"
        subtitle="Tarifas y beneficios de demostración"
      />
      <div className="plans-grid">
        {plans.map((plan) => (
          <Panel
            key={plan.name}
            className={cx("plan-card", plan.popular && "plan-featured")}
          >
            {plan.popular && <span className="popular-label">MÁS ELEGIDO</span>}
            <div className="plan-top">
              <div>
                <span>PLAN</span>
                <h3>{plan.name}</h3>
              </div>
              <StatusBadge tone="success">Activo</StatusBadge>
            </div>
            <div className="plan-price">
              <strong>{plan.price}</strong>
              <span>/ mes</span>
            </div>
            <div className="plan-members">
              <Users size={16} />
              {plan.members}
            </div>
            <ul>
              {plan.features.map((feature) => (
                <li key={feature}>
                  <Check size={15} />
                  {feature}
                </li>
              ))}
            </ul>
            <Button variant={plan.popular ? "primary" : "secondary"}>
              Administrar plan
            </Button>
          </Panel>
        ))}
      </div>
      <Panel>
        <SectionHeader
          title="Seguimiento de vigencias"
          subtitle="Acciones prioritarias · datos demo"
          action={
            <Button variant="secondary" icon={RefreshCw}>
              Actualizar
            </Button>
          }
        />
        <DataTable
          rows={membersSeed.slice(1)}
          columns={[
            { key: "name", label: "SOCIO" },
            { key: "plan", label: "PLAN" },
            { key: "expires", label: "FECHA LÍMITE" },
            {
              key: "status",
              label: "ESTADO",
              render: (row) => (
                <StatusBadge
                  tone={
                    row.status === "Activa"
                      ? "success"
                      : row.status === "Vencida"
                        ? "danger"
                        : "warning"
                  }
                >
                  {row.status}
                </StatusBadge>
              ),
            },
            {
              key: "id",
              label: "ACCIÓN",
              align: "right",
              render: (row) => (
                <Button
                  variant="ghost"
                  onClick={() => row.status === "Congelada" && setFreeze(true)}
                >
                  {row.status === "Congelada" ? "Ver congelación" : "Gestionar"}
                </Button>
              ),
            },
          ]}
        />
      </Panel>
      {freeze && (
        <Modal
          title="Detalle de congelación"
          subtitle="Política representada visualmente en el prototipo."
          onClose={() => setFreeze(false)}
          onConfirm={() => setFreeze(false)}
          confirmLabel="Entendido"
        >
          <div className="freeze-card">
            <CalendarClock size={24} />
            <div>
              <span>PERIODO DEMO</span>
              <strong>10 mar — 24 mar 2026</strong>
              <small>15 días · Primera congelación del año</small>
            </div>
          </div>
          <div className="policy-grid">
            <span>
              <strong>1 de 2</strong>
              <small>congelaciones anuales</small>
            </span>
            <span>
              <strong>15 de 15</strong>
              <small>días utilizados</small>
            </span>
          </div>
          <div className="warning-callout">
            <AlertTriangle size={18} />
            <span>
              Esta pantalla solo ilustra la política; no ejecuta cambios reales.
            </span>
          </div>
        </Modal>
      )}
    </div>
  )
}

function Recepcion() {
  const [access, setAccess] = useState<"idle" | "scanning" | "success">("idle")
  const scan = () => {
    setAccess("scanning")
    window.setTimeout(() => setAccess("success"), 900)
  }
  return (
    <div className="page-content reception-page">
      <PageIntro
        eyebrow="RECEPCIÓN"
        title="Control de acceso"
        copy="Vista operativa rápida para validar entradas y atender a cada socio."
        action={
          <StatusBadge tone="success">Puesto demo disponible</StatusBadge>
        }
      />
      <div className="reception-grid">
        <Panel className="access-console">
          <SectionHeader
            title="Validar acceso"
            subtitle="Simulación visual, sin lector ni servicio biométrico"
          />
          <div className={cx("scanner", access)}>
            <div className="scan-rings">
              <Fingerprint size={64} />
            </div>
            {access === "idle" && (
              <>
                <strong>Listo para identificar</strong>
                <span>Busca un socio o inicia la demostración visual</span>
              </>
            )}
            {access === "scanning" && (
              <>
                <strong>Validando demostración...</strong>
                <span>No se está leyendo información biométrica</span>
              </>
            )}
            {access === "success" && (
              <>
                <strong>Acceso visual autorizado</strong>
                <span>Resultado ficticio para evaluar la interfaz</span>
              </>
            )}
          </div>
          <Field
            icon={Search}
            placeholder="Buscar socio por nombre o folio..."
          />
          <Button
            className="full-button"
            icon={Fingerprint}
            onClick={scan}
            disabled={access === "scanning"}
          >
            {access === "scanning"
              ? "Validando..."
              : "Simular validación de acceso"}
          </Button>
          <div className="device-status">
            <span>
              <i /> Lector biométrico
            </span>
            <StatusBadge tone="neutral">No conectado · demo</StatusBadge>
          </div>
        </Panel>
        <Panel className="member-access-card">
          <SectionHeader
            title="Socio identificado"
            subtitle="Perfil de demostración"
          />
          {access === "success" ? (
            <div className="identified-member">
              <div className="member-hero">
                <span className="large-avatar">MT</span>
                <div>
                  <h3>Mariana Torres</h3>
                  <p>VTK-02418 · Integral Plus</p>
                </div>
                <StatusBadge tone="success">Acceso autorizado</StatusBadge>
              </div>
              <div className="member-facts">
                <span>
                  <small>VIGENCIA</small>
                  <strong>18 mar 2026</strong>
                </span>
                <span>
                  <small>ÚLTIMO ACCESO</small>
                  <strong>Hoy, 09:42</strong>
                </span>
                <span>
                  <small>VISITAS DEL MES</small>
                  <strong>22 accesos</strong>
                </span>
              </div>
              <div className="success-callout">
                <Check size={22} />
                <span>
                  <strong>Membresía activa</strong>
                  <small>
                    La información mostrada es completamente ficticia.
                  </small>
                </span>
              </div>
              <Button variant="secondary">Abrir perfil demo</Button>
            </div>
          ) : (
            <div className="empty-profile">
              <span>
                <Users size={32} />
              </span>
              <strong>Esperando identificación</strong>
              <p>
                Los detalles del socio aparecerán aquí al completar una
                validación visual.
              </p>
            </div>
          )}
        </Panel>
      </div>
      <Panel>
        <SectionHeader
          title="Accesos recientes"
          subtitle="Flujo de demostración de la recepción"
          action={
            <button type="button" className="text-button">
              Ver historial
            </button>
          }
        />
        <DataTable
          rows={membersSeed.slice(0, 4)}
          columns={[
            { key: "name", label: "SOCIO" },
            { key: "code", label: "FOLIO" },
            { key: "plan", label: "MEMBRESÍA" },
            {
              key: "visits",
              label: "HORA",
              render: (_, index?: never) => (
                <span>
                  {["09:42", "09:37", "09:21", "09:08"][Number(index) || 0] ||
                    "09:42"}
                </span>
              ),
            },
            {
              key: "status",
              label: "RESULTADO",
              render: (row) => (
                <StatusBadge
                  tone={row.status === "Vencida" ? "danger" : "success"}
                >
                  {row.status === "Vencida" ? "Rechazado" : "Autorizado"}
                </StatusBadge>
              ),
            },
          ]}
        />
      </Panel>
    </div>
  )
}

function Ventas() {
  const [cart, setCart] = useState<string[]>(["Mensualidad Fitness"])
  const [confirmed, setConfirmed] = useState(false)
  const products = [
    {
      name: "Mensualidad Fitness",
      category: "Membresía",
      price: "$749",
      icon: CreditCard,
    },
    {
      name: "Proteína Whey",
      category: "Suplemento",
      price: "$890",
      icon: PackagePlus,
    },
    {
      name: "Bebida isotónica",
      category: "Bebidas",
      price: "$45",
      icon: ShoppingCart,
    },
    {
      name: "Acceso por día",
      category: "Servicio",
      price: "$120",
      icon: DoorOpen,
    },
  ]
  return (
    <div className="page-content">
      <PageIntro
        eyebrow="VENTAS Y CAJA"
        title="Punto de venta"
        copy="Registra operaciones y consulta el estado del turno actual."
        action={
          <Button variant="secondary" icon={WalletCards}>
            Ver caja
          </Button>
        }
      />
      <div className="cash-strip">
        <div>
          <span className="cash-icon">
            <WalletCards size={20} />
          </span>
          <span>
            <small>CAJA ABIERTA · TURNO MATUTINO</small>
            <strong>Laura Méndez · desde 07:02</strong>
          </span>
        </div>
        <div>
          <span>VENTAS DEL TURNO</span>
          <strong>$18,420.00</strong>
        </div>
        <StatusBadge tone="success">Operando · demo</StatusBadge>
      </div>
      <div className="sales-grid">
        <Panel>
          <SectionHeader
            title="Catálogo rápido"
            subtitle="Selecciona conceptos para la venta demo"
          />
          <Field icon={Search} placeholder="Buscar producto o servicio..." />
          <div className="product-grid">
            {products.map((product) => (
              <button
                type="button"
                className="product-card"
                key={product.name}
                onClick={() => setCart([...cart, product.name])}
              >
                <span>
                  <product.icon size={20} />
                </span>
                <div>
                  <strong>{product.name}</strong>
                  <small>{product.category}</small>
                </div>
                <b>{product.price}</b>
                <Plus size={16} />
              </button>
            ))}
          </div>
          <SectionHeader
            title="Últimas operaciones"
            subtitle="Movimientos de demostración"
          />
          <DataTable
            rows={[
              {
                id: 1,
                folio: "V-1048",
                concept: "Integral Plus",
                total: "$999.00",
                method: "Tarjeta",
              },
              {
                id: 2,
                folio: "V-1047",
                concept: "Bebida isotónica",
                total: "$45.00",
                method: "Efectivo",
              },
            ]}
            columns={[
              { key: "folio", label: "FOLIO" },
              { key: "concept", label: "CONCEPTO" },
              { key: "method", label: "MÉTODO" },
              { key: "total", label: "TOTAL", align: "right" },
            ]}
          />
        </Panel>
        <Panel className="checkout">
          <SectionHeader
            title="Venta actual"
            subtitle={`${cart.length} concepto(s) · demo`}
            action={
              <button
                type="button"
                className="text-button"
                onClick={() => setCart([])}
              >
                Limpiar
              </button>
            }
          />
          <Field icon={Users} placeholder="Asignar socio (opcional)..." />
          <div className="cart-list">
            {cart.length ? (
              cart.map((item, index) => (
                <div className="cart-row" key={`${item}-${index}`}>
                  <span>{index + 1}</span>
                  <div>
                    <strong>{item}</strong>
                    <small>Cantidad: 1</small>
                  </div>
                  <b>
                    {item.includes("Fitness")
                      ? "$749.00"
                      : item.includes("Proteína")
                        ? "$890.00"
                        : "$45.00"}
                  </b>
                  <button
                    type="button"
                    onClick={() => setCart(cart.filter((_, i) => i !== index))}
                  >
                    <X size={15} />
                  </button>
                </div>
              ))
            ) : (
              <div className="empty-cart">
                <ShoppingCart size={28} />
                <strong>Venta vacía</strong>
                <span>Agrega un concepto para comenzar.</span>
              </div>
            )}
          </div>
          <div className="totals">
            <span>
              Subtotal <b>$749.00</b>
            </span>
            <span>
              Impuestos incluidos <b>$0.00</b>
            </span>
            <span className="total-line">
              Total <b>{cart.length ? "$749.00" : "$0.00"}</b>
            </span>
          </div>
          <div className="payment-methods">
            <button type="button" className="selected">
              <CreditCard size={18} />
              Tarjeta
            </button>
            <button type="button">
              <BadgeDollarSign size={18} />
              Efectivo
            </button>
          </div>
          <Button
            icon={ReceiptText}
            className="full-button"
            disabled={!cart.length}
            onClick={() => setConfirmed(true)}
          >
            Confirmar venta demo
          </Button>
        </Panel>
      </div>
      {confirmed && (
        <Modal
          title="Venta demostrativa completada"
          subtitle="No se realizó ningún cargo ni movimiento real."
          onClose={() => setConfirmed(false)}
          onConfirm={() => {
            setConfirmed(false)
            setCart([])
          }}
          confirmLabel="Finalizar"
        >
          <div className="modal-success">
            <span>
              <Check size={28} />
            </span>
            <strong>Operación visual exitosa</strong>
            <p>Folio de demostración V-1049 · Total ilustrativo $749.00</p>
          </div>
        </Modal>
      )}
    </div>
  )
}

const inventoryRows = [
  {
    id: 1,
    product: "Proteína Whey Chocolate",
    sku: "SUP-1042",
    category: "Suplementos",
    stock: "18 pzas.",
    price: "$890.00",
    state: "Disponible",
  },
  {
    id: 2,
    product: "Bebida isotónica 600 ml",
    sku: "BEB-0214",
    category: "Bebidas",
    stock: "6 pzas.",
    price: "$45.00",
    state: "Stock bajo",
  },
  {
    id: 3,
    product: "Toalla deportiva Vértika",
    sku: "ACC-0082",
    category: "Accesorios",
    stock: "32 pzas.",
    price: "$180.00",
    state: "Disponible",
  },
  {
    id: 4,
    product: "Barra energética cacao",
    sku: "ALI-0311",
    category: "Alimentos",
    stock: "0 pzas.",
    price: "$55.00",
    state: "Agotado",
  },
]

function Inventario() {
  const [query, setQuery] = useState("")
  const [modal, setModal] = useState(false)
  const filtered = inventoryRows.filter((row) =>
    row.product.toLowerCase().includes(query.toLowerCase()),
  )
  return (
    <div className="page-content">
      <PageIntro
        eyebrow="INVENTARIO"
        title="Productos y existencias"
        copy="Control visual del catálogo, movimientos y niveles de reposición."
        action={
          <Button icon={PackagePlus} onClick={() => setModal(true)}>
            Nuevo producto
          </Button>
        }
      />
      <div className="stats-grid compact-stats">
        <StatCard
          label="Productos activos"
          value="86"
          detail="en 6 categorías"
          icon={Box}
        />
        <StatCard
          label="Valor de inventario"
          value="$128,450"
          detail="estimado demo"
          icon={CircleDollarSign}
          tone="green"
        />
        <StatCard
          label="Stock bajo"
          value="3"
          detail="requieren atención"
          icon={AlertTriangle}
          tone="amber"
        />
        <StatCard
          label="Movimientos hoy"
          value="24"
          detail="entradas y salidas"
          icon={RefreshCw}
          tone="violet"
        />
      </div>
      <Panel>
        <div className="toolbar">
          <Field
            icon={Search}
            value={query}
            onChange={setQuery}
            placeholder="Buscar producto o SKU..."
          />
          <SelectField
            value="Todas las categorías"
            options={[
              "Todas las categorías",
              "Suplementos",
              "Bebidas",
              "Accesorios",
            ]}
          />
          <Button variant="secondary" icon={SlidersHorizontal}>
            Filtros
          </Button>
        </div>
        <DataTable
          rows={filtered}
          columns={[
            {
              key: "product",
              label: "PRODUCTO",
              render: (row) => (
                <div className="product-cell">
                  <span>
                    <Box size={17} />
                  </span>
                  <div>
                    <strong>{row.product}</strong>
                    <small>{row.sku}</small>
                  </div>
                </div>
              ),
            },
            { key: "category", label: "CATEGORÍA" },
            { key: "stock", label: "EXISTENCIA" },
            { key: "price", label: "PRECIO" },
            {
              key: "state",
              label: "ESTADO",
              render: (row) => (
                <StatusBadge
                  tone={
                    row.state === "Disponible"
                      ? "success"
                      : row.state === "Agotado"
                        ? "danger"
                        : "warning"
                  }
                >
                  {row.state}
                </StatusBadge>
              ),
            },
            {
              key: "id",
              label: "",
              align: "right",
              render: () => <Button variant="ghost">Editar</Button>,
            },
          ]}
        />
      </Panel>
      {modal && (
        <Modal
          title="Agregar producto"
          subtitle="Alta visual de demostración."
          onClose={() => setModal(false)}
          onConfirm={() => setModal(false)}
        >
          <div className="form-grid">
            <Field label="Nombre del producto" />
            <Field label="SKU" />
            <SelectField
              label="Categoría"
              value="Suplementos"
              options={["Suplementos", "Bebidas", "Accesorios", "Alimentos"]}
            />
            <Field label="Precio de venta" placeholder="$0.00" />
            <Field label="Existencia inicial" type="number" />
            <Field label="Stock mínimo" type="number" />
          </div>
        </Modal>
      )}
    </div>
  )
}

function Empleados() {
  const [modal, setModal] = useState(false)
  const staff = [
    {
      id: 1,
      name: "Laura Méndez",
      role: "Administración",
      shift: "Matutino",
      contact: "laura@vertika.demo",
      status: "Activo",
    },
    {
      id: 2,
      name: "Carlos Peña",
      role: "Recepción",
      shift: "Vespertino",
      contact: "carlos@vertika.demo",
      status: "Activo",
    },
    {
      id: 3,
      name: "Sofía Aguirre",
      role: "Entrenadora",
      shift: "Mixto",
      contact: "sofia@vertika.demo",
      status: "Activo",
    },
    {
      id: 4,
      name: "Marco León",
      role: "Recepción",
      shift: "Matutino",
      contact: "marco@vertika.demo",
      status: "Inactivo",
    },
  ]
  return (
    <div className="page-content">
      <PageIntro
        eyebrow="EQUIPO"
        title="Empleados"
        copy="Consulta perfiles laborales, turnos y estado del personal."
        action={
          <Button icon={UserPlus} onClick={() => setModal(true)}>
            Registrar empleado
          </Button>
        }
      />
      <div className="people-highlight">
        <Panel>
          <span>
            <Users size={20} />
          </span>
          <div>
            <small>PERSONAL ACTIVO</small>
            <strong>24</strong>
          </div>
          <b>+2 este mes</b>
        </Panel>
        <Panel>
          <span>
            <Clock3 size={20} />
          </span>
          <div>
            <small>EN TURNO AHORA</small>
            <strong>8</strong>
          </div>
          <b>33% del equipo</b>
        </Panel>
        <Panel>
          <span>
            <Dumbbell size={20} />
          </span>
          <div>
            <small>ENTRENADORES</small>
            <strong>9</strong>
          </div>
          <b>6 disponibles</b>
        </Panel>
      </div>
      <Panel>
        <div className="toolbar">
          <Field icon={Search} placeholder="Buscar empleado..." />
          <SelectField
            value="Todos los roles"
            options={[
              "Todos los roles",
              "Administración",
              "Recepción",
              "Entrenadores",
            ]}
          />
        </div>
        <DataTable
          rows={staff}
          columns={[
            {
              key: "name",
              label: "EMPLEADO",
              render: (row) => (
                <div className="person-cell">
                  <span>
                    {row.name
                      .split(" ")
                      .map((v) => v[0])
                      .join("")}
                  </span>
                  <div>
                    <strong>{row.name}</strong>
                    <small>{row.contact}</small>
                  </div>
                </div>
              ),
            },
            { key: "role", label: "ÁREA" },
            { key: "shift", label: "TURNO" },
            {
              key: "status",
              label: "ESTADO",
              render: (row) => (
                <StatusBadge
                  tone={row.status === "Activo" ? "success" : "neutral"}
                >
                  {row.status}
                </StatusBadge>
              ),
            },
            {
              key: "id",
              label: "",
              align: "right",
              render: () => <Button variant="ghost">Ver expediente</Button>,
            },
          ]}
        />
      </Panel>
      {modal && (
        <Modal
          title="Registrar empleado"
          subtitle="Datos ilustrativos, sin persistencia."
          onClose={() => setModal(false)}
          onConfirm={() => setModal(false)}
        >
          <div className="form-grid">
            <Field label="Nombre completo" />
            <Field label="Correo institucional" type="email" />
            <SelectField
              label="Área"
              value="Recepción"
              options={["Recepción", "Entrenadores", "Administración"]}
            />
            <SelectField
              label="Turno"
              value="Matutino"
              options={["Matutino", "Vespertino", "Mixto"]}
            />
            <Field label="Teléfono" />
            <Field label="Fecha de ingreso" type="date" />
          </div>
        </Modal>
      )}
    </div>
  )
}

function Usuarios() {
  const [permissions, setPermissions] = useState({
    reports: true,
    sales: true,
    users: false,
  })
  const accounts = [
    {
      id: 1,
      name: "Laura Méndez",
      user: "laura.m",
      role: "Superadministradora",
      last: "Hoy, 09:46",
      status: "Activa",
    },
    {
      id: 2,
      name: "Carlos Peña",
      user: "carlos.p",
      role: "Recepción",
      last: "Hoy, 09:31",
      status: "Activa",
    },
    {
      id: 3,
      name: "Ana Lozano",
      user: "ana.l",
      role: "Caja",
      last: "Ayer, 19:02",
      status: "Activa",
    },
    {
      id: 4,
      name: "Marco León",
      user: "marco.l",
      role: "Recepción",
      last: "02 mar 2026",
      status: "Suspendida",
    },
  ]
  return (
    <div className="page-content">
      <PageIntro
        eyebrow="SEGURIDAD"
        title="Usuarios y permisos"
        copy="Representación visual de cuentas, roles efectivos y acceso por módulo."
        action={<Button icon={UserPlus}>Invitar usuario</Button>}
      />
      <div className="security-note">
        <ShieldCheck size={22} />
        <div>
          <strong>Control administrativo</strong>
          <span>
            En el producto final, únicamente el superadministrador podrá asignar
            o revocar roles. Esta vista no modifica permisos reales.
          </span>
        </div>
      </div>
      <div className="users-grid">
        <Panel>
          <SectionHeader
            title="Cuentas del sistema"
            subtitle="4 usuarios de demostración"
          />
          <DataTable
            rows={accounts}
            columns={[
              {
                key: "name",
                label: "USUARIO",
                render: (row) => (
                  <div className="person-cell">
                    <span>
                      {row.name
                        .split(" ")
                        .map((v) => v[0])
                        .join("")}
                    </span>
                    <div>
                      <strong>{row.name}</strong>
                      <small>@{row.user}</small>
                    </div>
                  </div>
                ),
              },
              { key: "role", label: "ROL EFECTIVO" },
              { key: "last", label: "ÚLTIMO ACCESO" },
              {
                key: "status",
                label: "ESTADO",
                render: (row) => (
                  <StatusBadge
                    tone={row.status === "Activa" ? "success" : "danger"}
                  >
                    {row.status}
                  </StatusBadge>
                ),
              },
            ]}
          />
        </Panel>
        <Panel className="permissions-panel">
          <SectionHeader
            title="Rol: Recepción"
            subtitle="Vista previa de permisos demo"
            action={<StatusBadge tone="info">6 usuarios</StatusBadge>}
          />
          <div className="permission-list">
            <Toggle
              checked
              onChange={() => {}}
              label="Socios"
              description="Consultar y registrar perfiles"
            />
            <Toggle
              checked
              onChange={() => {}}
              label="Control de acceso"
              description="Validar entradas y consultar historial"
            />
            <Toggle
              checked={permissions.sales}
              onChange={() =>
                setPermissions({ ...permissions, sales: !permissions.sales })
              }
              label="Ventas"
              description="Crear operaciones de mostrador"
            />
            <Toggle
              checked={permissions.reports}
              onChange={() =>
                setPermissions({
                  ...permissions,
                  reports: !permissions.reports,
                })
              }
              label="Reportes"
              description="Consultar reportes operativos"
            />
            <Toggle
              checked={permissions.users}
              onChange={() =>
                setPermissions({ ...permissions, users: !permissions.users })
              }
              label="Usuarios y roles"
              description="Gestionar cuentas del sistema"
            />
          </div>
          <Button variant="secondary" className="full-button">
            Guardar vista previa
          </Button>
        </Panel>
      </div>
    </div>
  )
}

function Reportes() {
  const [period, setPeriod] = useState("Este mes")
  const reportCards = [
    {
      title: "Ingresos por periodo",
      copy: "Ventas, membresías y métodos de pago",
      icon: TrendingUp,
      color: "blue",
    },
    {
      title: "Actividad de socios",
      copy: "Altas, bajas, accesos y retención",
      icon: Users,
      color: "green",
    },
    {
      title: "Vencimientos",
      copy: "Membresías y seguimiento comercial",
      icon: CalendarClock,
      color: "amber",
    },
    {
      title: "Inventario",
      copy: "Existencias, rotación y movimientos",
      icon: Box,
      color: "violet",
    },
  ]
  return (
    <div className="page-content">
      <PageIntro
        eyebrow="ANÁLISIS"
        title="Centro de reportes"
        copy="Explora indicadores de demostración con filtros visuales consistentes."
        action={
          <Button variant="secondary" icon={ReceiptText}>
            Historial de reportes
          </Button>
        }
      />
      <div className="report-filters">
        <SelectField
          label="Periodo"
          value={period}
          options={[
            "Hoy",
            "Esta semana",
            "Este mes",
            "Este trimestre",
            "Personalizado",
          ]}
          onChange={setPeriod}
        />
        <Field label="Desde" type="date" value="2026-03-01" />
        <Field label="Hasta" type="date" value="2026-03-31" />
        <Button icon={BarChart3}>Aplicar filtros</Button>
      </div>
      <div className="report-grid">
        {reportCards.map((report) => (
          <Panel key={report.title} className="report-card">
            <span className={cx("report-icon", `report-${report.color}`)}>
              <report.icon size={22} />
            </span>
            <div>
              <h3>{report.title}</h3>
              <p>{report.copy}</p>
            </div>
            <Button variant="ghost">
              Abrir reporte <ArrowRight size={15} />
            </Button>
          </Panel>
        ))}
      </div>
      <div className="dashboard-grid">
        <Panel>
          <SectionHeader
            title="Distribución de ingresos"
            subtitle={`${period} · datos ficticios`}
          />
          <div className="donut-layout">
            <div className="donut">
              <div>
                <strong>$384k</strong>
                <span>Total demo</span>
              </div>
            </div>
            <div className="legend">
              <span>
                <i className="legend-blue" />
                <b>Membresías</b>
                <strong>68%</strong>
              </span>
              <span>
                <i className="legend-violet" />
                <b>Productos</b>
                <strong>19%</strong>
              </span>
              <span>
                <i className="legend-green" />
                <b>Servicios</b>
                <strong>13%</strong>
              </span>
            </div>
          </div>
        </Panel>
        <Panel>
          <SectionHeader
            title="Accesos por día"
            subtitle="Semana actual · datos ficticios"
          />
          <div className="horizontal-bars">
            {[
              ["Lun", 82],
              ["Mar", 68],
              ["Mié", 94],
              ["Jue", 74],
              ["Vie", 86],
              ["Sáb", 52],
            ].map(([day, value]) => (
              <div key={day}>
                <span>{day}</span>
                <i>
                  <b style={{ width: `${value}%` }} />
                </i>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  )
}

function Configuracion() {
  const [tab, setTab] = useState("General")
  const [settings, setSettings] = useState({
    notifications: true,
    expiry: true,
    stock: false,
    compact: false,
  })
  return (
    <div className="page-content">
      <PageIntro
        eyebrow="SISTEMA"
        title="Configuración"
        copy="Personaliza la experiencia visual del prototipo y consulta su estado."
        action={<Button icon={Check}>Guardar vista previa</Button>}
      />
      <div className="settings-layout">
        <Panel className="settings-nav">
          {[
            "General",
            "Notificaciones",
            "Operación",
            "Seguridad",
            "Apariencia",
          ].map((item) => (
            <button
              type="button"
              key={item}
              className={tab === item ? "active" : ""}
              onClick={() => setTab(item)}
            >
              {item === "General" ? (
                <Settings size={17} />
              ) : item === "Notificaciones" ? (
                <Bell size={17} />
              ) : item === "Operación" ? (
                <Activity size={17} />
              ) : item === "Seguridad" ? (
                <ShieldCheck size={17} />
              ) : (
                <SlidersHorizontal size={17} />
              )}
              {item}
              <ArrowRight size={15} />
            </button>
          ))}
        </Panel>
        <div className="settings-content">
          <Panel>
            <SectionHeader
              title={tab}
              subtitle="Preferencias visuales de demostración"
            />
            {tab === "General" && (
              <div className="settings-form">
                <Field
                  label="Nombre comercial"
                  value="VÉRTIKA Fitness Center"
                />
                <Field label="Zona horaria" value="América/Ciudad de México" />
                <div className="form-grid">
                  <SelectField
                    label="Idioma"
                    value="Español (México)"
                    options={["Español (México)", "English"]}
                  />
                  <SelectField
                    label="Moneda"
                    value="MXN — Peso mexicano"
                    options={["MXN — Peso mexicano", "USD — Dólar"]}
                  />
                </div>
              </div>
            )}
            {tab === "Notificaciones" && (
              <div className="permission-list">
                <Toggle
                  checked={settings.notifications}
                  onChange={() =>
                    setSettings({
                      ...settings,
                      notifications: !settings.notifications,
                    })
                  }
                  label="Resumen operativo"
                  description="Recibir un resumen diario de actividad"
                />
                <Toggle
                  checked={settings.expiry}
                  onChange={() =>
                    setSettings({ ...settings, expiry: !settings.expiry })
                  }
                  label="Membresías por vencer"
                  description="Alertas anticipadas para seguimiento"
                />
                <Toggle
                  checked={settings.stock}
                  onChange={() =>
                    setSettings({ ...settings, stock: !settings.stock })
                  }
                  label="Stock bajo"
                  description="Notificar niveles críticos de inventario"
                />
              </div>
            )}
            {tab === "Operación" && (
              <div className="settings-form">
                <SelectField
                  label="Duración predeterminada de membresía"
                  value="30 días"
                  options={["30 días", "90 días", "365 días"]}
                />
                <SelectField
                  label="Tolerancia de acceso"
                  value="Sin tolerancia"
                  options={["Sin tolerancia", "1 día", "3 días"]}
                />
                <div className="info-callout">
                  <Activity size={18} />
                  <span>
                    <strong>Configuración ilustrativa</strong>
                    <small>
                      No modifica reglas de negocio ni contratos reales.
                    </small>
                  </span>
                </div>
              </div>
            )}
            {tab === "Seguridad" && (
              <div className="security-settings">
                <div>
                  <span>
                    <ShieldCheck size={22} />
                  </span>
                  <div>
                    <strong>Políticas de acceso</strong>
                    <p>
                      Los permisos efectivos deberán validarse en la
                      implementación real.
                    </p>
                  </div>
                  <StatusBadge tone="success">Recomendado</StatusBadge>
                </div>
                <Button variant="secondary">Revisar política demo</Button>
              </div>
            )}
            {tab === "Apariencia" && (
              <div className="permission-list">
                <Toggle
                  checked={!settings.compact}
                  onChange={() =>
                    setSettings({ ...settings, compact: !settings.compact })
                  }
                  label="Navegación amplia"
                  description="Muestra etiquetas junto a los iconos"
                />
                <div className="theme-preview">
                  <span className="active-theme">
                    <i />
                    <strong>Vértika oscuro</strong>
                    <small>Predeterminado</small>
                  </span>
                  <span>
                    <i />
                    <strong>Contraste claro</strong>
                    <small>Referencia futura</small>
                  </span>
                </div>
              </div>
            )}
          </Panel>
          <Panel className="prototype-info">
            <span className="prototype-icon">
              <Dumbbell size={22} />
            </span>
            <div>
              <strong>VÉRTIKA · Prototipo visual</strong>
              <p>React + TypeScript · Sin integraciones reales</p>
            </div>
            <StatusBadge tone="info">v0.1 demo</StatusBadge>
          </Panel>
        </div>
      </div>
    </div>
  )
}

function AppShell({ onLogout }: { onLogout: () => void }) {
  const [page, setPage] = useState<PageId>("dashboard")
  const [collapsed, setCollapsed] = useState(false)
  const content = useMemo(() => {
    switch (page) {
      case "socios":
        return <Socios />
      case "membresias":
        return <Membresias />
      case "recepcion":
        return <Recepcion />
      case "ventas":
        return <Ventas />
      case "inventario":
        return <Inventario />
      case "empleados":
        return <Empleados />
      case "usuarios":
        return <Usuarios />
      case "reportes":
        return <Reportes />
      case "configuracion":
        return <Configuracion />
      default:
        return <Dashboard />
    }
  }, [page])
  return (
    <div className="app-shell">
      <Sidebar
        page={page}
        onNavigate={setPage}
        collapsed={collapsed}
        onCollapse={() => setCollapsed(!collapsed)}
      />
      <div className="workspace">
        <Topbar page={page} onNavigate={setPage} onLogout={onLogout} />
        <main className="workspace-main">{content}</main>
      </div>
    </div>
  )
}

export default function App() {
  const [authenticated, setAuthenticated] = useState(
    () => new URLSearchParams(window.location.search).get("preview") === "app",
  )
  return authenticated ? (
    <AppShell onLogout={() => setAuthenticated(false)} />
  ) : (
    <Login onLogin={() => setAuthenticated(true)} />
  )
}

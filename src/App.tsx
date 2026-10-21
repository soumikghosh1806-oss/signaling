import { FormEvent, ReactNode, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import L from "leaflet";

type View =
  | "Overview"
  | "Incidents"
  | "Report"
  | "Alerts"
  | "Community"
  | "My Reports"
  | "Settings"
  | "Incident Detail";

type IconName =
  | "grid"
  | "alert"
  | "plus"
  | "bell"
  | "users"
  | "file"
  | "settings"
  | "search"
  | "map"
  | "check"
  | "clock"
  | "arrow"
  | "menu"
  | "close"
  | "shield"
  | "upload";

type Incident = {
  id: string;
  type: string;
  location: string;
  area: string;
  time: string;
  severity: string;
  status: string;
  confidence: number;
  distance: string;
  tone: string;
  latitude: number;
  longitude: number;
};

const incidents: Incident[] = [
  {
    id: "SIG-2048",
    type: "Structure fire",
    location: "8th Ave & Fulton Street",
    area: "Civic Center",
    time: "8 min ago",
    severity: "Critical",
    status: "Verified",
    confidence: 96,
    distance: "0.8 mi",
    tone: "red",
    latitude: 37.7749,
    longitude: -122.4194,
  },
  {
    id: "SIG-2047",
    type: "Road obstruction",
    location: "Eastbound Harbor Parkway",
    area: "Waterfront",
    time: "21 min ago",
    severity: "Moderate",
    status: "Corroborating",
    confidence: 72,
    distance: "1.4 mi",
    tone: "amber",
    latitude: 37.7767,
    longitude: -122.4148,
  },
  {
    id: "SIG-2044",
    type: "Power outage",
    location: "Pine Street corridor",
    area: "North Market",
    time: "46 min ago",
    severity: "Moderate",
    status: "Verified",
    confidence: 89,
    distance: "2.1 mi",
    tone: "blue",
    latitude: 37.7815,
    longitude: -122.4212,
  },
  {
    id: "SIG-2038",
    type: "Gas odor",
    location: "330 Willow Court",
    area: "West End",
    time: "1 hr ago",
    severity: "Low",
    status: "Resolved",
    confidence: 94,
    distance: "3.6 mi",
    tone: "green",
    latitude: 37.7695,
    longitude: -122.425,
  },
];

const navigation: { label: View; icon: IconName }[] = [
  { label: "Overview", icon: "grid" },
  { label: "Incidents", icon: "alert" },
  { label: "Report", icon: "plus" },
  { label: "Alerts", icon: "bell" },
  { label: "Community", icon: "users" },
  { label: "My Reports", icon: "file" },
  { label: "Settings", icon: "settings" },
];

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
    alert: (
      <>
        <path d="M10.3 3.5 2.7 17a2 2 0 0 0 1.8 3h15a2 2 0 0 0 1.8-3L13.7 3.5a2 2 0 0 0-3.4 0Z" />
        <path d="M12 9v4M12 17h.01" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" />
      </>
    ),
    file: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
        <path d="M14 2v6h6M8 13h8M8 17h6" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6 1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    map: (
      <>
        <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3Z" />
        <path d="M9 3v15M15 6v15" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </>
    ),
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    shield: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    upload: (
      <>
        <path d="M12 16V4M7 9l5-5 5 5" />
        <path d="M5 20h14" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

function Status({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: string;
}) {
  return (
    <span className={`status status-${tone}`}>
      <span className="status-dot" />
      {children}
    </span>
  );
}

function PageTitle({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="page-title">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </header>
  );
}

/* -------------------------------------------------------
   REAL MAP
------------------------------------------------------- */

const markerColors: Record<string, string> = {
  red: "#FF4F5E",
  amber: "#F2A51A",
  blue: "#3D6FE8",
  green: "#159A72",
};

function createIncidentIcon(tone: string) {
  const color = markerColors[tone] || "#3D6FE8";

  return L.divIcon({
    className: "signal-leaflet-marker",
    html: `
      <div style="
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: ${color};
        border: 3px solid white;
        box-shadow: 0 3px 12px rgba(0,0,0,.30);
        position: relative;
      ">
        <div style="
          position:absolute;
          width:7px;
          height:7px;
          border-radius:50%;
          background:white;
          left:5px;
          top:5px;
        "></div>
      </div>
    `,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -10],
  });
}

function MapZoomControls() {
  const map = useMap();

  return (
    <div className="map-controls">
      <button
        aria-label="Zoom in"
        onClick={() => map.zoomIn()}
      >
        +
      </button>

      <button
        aria-label="Zoom out"
        onClick={() => map.zoomOut()}
      >
        −
      </button>
    </div>
  );
}

function MapView({
  detailed = false,
  onIncident,
}: {
  detailed?: boolean;
  onIncident?: () => void;
}) {
  const center: [number, number] = [37.7762, -122.4195];

  const mapIncidents = incidents.slice(0, 3);

  return (
    <div
      className={`map-view ${detailed ? "map-detailed" : ""}`}
      aria-label="Live incident map"
    >
      <MapContainer
        center={center}
        zoom={14}
        scrollWheelZoom={true}
        zoomControl={false}
        style={{
          height: "100%",
          width: "100%",
          borderRadius: "inherit",
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {mapIncidents.map((incident) => (
          <div key={incident.id}>
            <Marker
              position={[incident.latitude, incident.longitude]}
              icon={createIncidentIcon(incident.tone)}
            >
              <Popup>
                <div style={{ minWidth: "180px" }}>
                  <strong
                    style={{
                      display: "block",
                      fontSize: "14px",
                      marginBottom: "5px",
                    }}
                  >
                    {incident.type}
                  </strong>

                  <span
                    style={{
                      display: "block",
                      fontSize: "12px",
                      marginBottom: "6px",
                    }}
                  >
                    {incident.location}
                  </span>

                  <span
                    style={{
                      display: "block",
                      fontSize: "12px",
                      marginBottom: "4px",
                    }}
                  >
                    Status: {incident.status}
                  </span>

                  <span
                    style={{
                      display: "block",
                      fontSize: "12px",
                    }}
                  >
                    Confidence: {incident.confidence}%
                  </span>

                  {onIncident && (
                    <button
                      onClick={onIncident}
                      style={{
                        marginTop: "10px",
                        border: "none",
                        background: "#25233A",
                        color: "white",
                        padding: "7px 10px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "11px",
                      }}
                    >
                      View incident →
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>

            <Circle
              center={[incident.latitude, incident.longitude]}
              radius={detailed ? 180 : 120}
              pathOptions={{
                color: markerColors[incident.tone],
                fillColor: markerColors[incident.tone],
                fillOpacity: 0.08,
                weight: 1,
              }}
            />
          </div>
        ))}

        {detailed && (
          <Circle
            center={center}
            radius={965}
            pathOptions={{
              color: "#FF4F5E",
              fillColor: "#FF4F5E",
              fillOpacity: 0.04,
              weight: 1,
              dashArray: "6 6",
            }}
          />
        )}

        <MapZoomControls />
      </MapContainer>

      <div className="map-key">
        <span className="key-dot" />
        {detailed ? "Affected area · 0.6 mi" : "3 active nearby"}
      </div>
    </div>
  );
}

function Confidence({ value }: { value: number }) {
  return (
    <div className="confidence">
      <div className="confidence-label">
        <span>Confidence</span>
        <strong>{value}%</strong>
      </div>

      <div className="confidence-track">
        <span style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

/* -------------------------------------------------------
   OVERVIEW
------------------------------------------------------- */

function Overview({ go }: { go: (view: View) => void }) {
  return (
    <>
      <PageTitle
        eyebrow="Monday, June 16"
        title="Good morning, Neel."
        description="Here’s what’s happening near Civic Center."
        action={
          <button
            className="primary-action"
            onClick={() => go("Report")}
          >
            <Icon name="plus" />
            Report emergency
          </button>
        }
      />

      <section className="stats-row" aria-label="Local incident statistics">
        <div className="stat">
          <span>Active nearby</span>
          <strong>3</strong>
          <small>Within 5 miles</small>
        </div>

        <div className="stat">
          <span>Verified today</span>
          <strong>12</strong>
          <small>
            <em className="positive">+4</em> since yesterday
          </small>
        </div>

        <div className="stat">
          <span>Avg. response</span>
          <strong>6m</strong>
          <small>Community to verification</small>
        </div>

        <div className="stat">
          <span>Your contributions</span>
          <strong>8</strong>
          <small>Reports and corroborations</small>
        </div>
      </section>

      <div className="overview-grid">
        <section className="panel map-panel">
          <div className="panel-heading">
            <div>
              <span className="section-kicker">Live map</span>
              <h2>Your area</h2>
            </div>

            <button
              className="text-button"
              onClick={() => go("Incidents")}
            >
              Open incidents <Icon name="arrow" size={15} />
            </button>
          </div>

          <MapView
            onIncident={() => go("Incident Detail")}
          />
        </section>

        <section className="panel activity-panel">
          <div className="panel-heading">
            <div>
              <span className="section-kicker">
                Nearby activity
              </span>
              <h2>Latest reports</h2>
            </div>

            <span className="live-indicator">
              <i /> Live
            </span>
          </div>

          <div className="activity-list">
            {incidents.slice(0, 3).map((item) => (
              <button
                className="activity-item"
                key={item.id}
                onClick={() =>
                  item.id === "SIG-2048" &&
                  go("Incident Detail")
                }
              >
                <span
                  className={`incident-mark ${item.tone}`}
                >
                  <Icon
                    name={
                      item.status === "Resolved"
                        ? "check"
                        : "alert"
                    }
                    size={16}
                  />
                </span>

                <span className="activity-copy">
                  <strong>{item.type}</strong>
                  <span>{item.location}</span>
                  <small>
                    {item.time} · {item.distance}
                  </small>
                </span>

                <Status tone={item.tone}>
                  {item.status}
                </Status>
              </button>
            ))}
          </div>

          <button
            className="full-text-button"
            onClick={() => go("Incidents")}
          >
            View all live incidents{" "}
            <Icon name="arrow" size={15} />
          </button>
        </section>
      </div>

      <aside className="safety-note">
        <Icon name="shield" size={22} />

        <div>
          <strong>Community-verified information</strong>
          <span>
            Signal combines trusted reports, corroborations,
            and official sources. Always follow instructions
            from local authorities.
          </span>
        </div>

        <button>How confidence works</button>
      </aside>
    </>
  );
}

/* -------------------------------------------------------
   INCIDENTS
------------------------------------------------------- */

function Incidents({ go }: { go: (view: View) => void }) {
  const [filter, setFilter] = useState("All incidents");

  return (
    <>
      <PageTitle
        eyebrow="Live intelligence"
        title="Incidents"
        description="Verified and emerging reports across your area."
        action={
          <button
            className="primary-action"
            onClick={() => go("Report")}
          >
            <Icon name="plus" />
            New report
          </button>
        }
      />

      <div className="filter-bar">
        <label className="search">
          <Icon name="search" />
          <input
            aria-label="Search incidents"
            placeholder="Search location or incident"
          />
        </label>

        <div className="filter-pills">
          {[
            "All incidents",
            "Verified",
            "Unverified",
            "Resolved",
          ].map((item) => (
            <button
              className={filter === item ? "active" : ""}
              onClick={() => setFilter(item)}
              key={item}
            >
              {item}
            </button>
          ))}
        </div>

        <button className="filter-select">
          <Icon name="map" />
          Within 5 miles
        </button>
      </div>

      <div className="incidents-layout">
        <section className="incident-results">
          <div className="result-meta">
            <span>{incidents.length} incidents</span>
            <button>Most recent ↓</button>
          </div>

          {incidents
            .filter(
              (i) =>
                filter === "All incidents" ||
                i.status === filter ||
                (filter === "Unverified" &&
                  i.status === "Corroborating")
            )
            .map((item) => (
              <button
                className="incident-row"
                key={item.id}
                onClick={() => go("Incident Detail")}
              >
                <span
                  className={`incident-mark large ${item.tone}`}
                >
                  <Icon
                    name={
                      item.status === "Resolved"
                        ? "check"
                        : "alert"
                    }
                  />
                </span>

                <span className="incident-row-main">
                  <span className="incident-topline">
                    <strong>{item.type}</strong>

                    <Status tone={item.tone}>
                      {item.status}
                    </Status>
                  </span>

                  <span>{item.location}</span>

                  <small>
                    {item.area} · {item.time}
                  </small>

                  <Confidence value={item.confidence} />
                </span>

                <span className="distance">
                  {item.distance}
                  <Icon name="arrow" size={15} />
                </span>
              </button>
            ))}
        </section>

        <section className="sticky-map">
          <MapView
            onIncident={() => go("Incident Detail")}
          />
        </section>
      </div>
    </>
  );
}

/* -------------------------------------------------------
   INCIDENT DETAIL
------------------------------------------------------- */

function IncidentDetail({ go }: { go: (view: View) => void }) {
  return (
    <>
      <button
        className="back-button"
        onClick={() => go("Incidents")}
      >
        ← Back to incidents
      </button>

      <PageTitle
        eyebrow="Incident SIG-2048 · Active"
        title="Structure fire"
        description="8th Ave & Fulton Street, Civic Center"
        action={
          <Status tone="red">
            Critical severity
          </Status>
        }
      />

      <div className="detail-grid">
        <section className="detail-main">
          <MapView detailed />

          <div className="detail-summary">
            <div>
              <span className="section-kicker">
                Current situation
              </span>

              <h2>
                Heavy smoke reported from upper floors
              </h2>

              <p>
                Multiple community members have reported
                visible smoke and emergency crews arriving
                on scene. Avoid 8th Avenue between Fulton
                and Grove.
              </p>
            </div>

            <div className="confidence-card">
              <span>Signal confidence</span>
              <strong>96%</strong>
              <small>Very high confidence</small>
              <Confidence value={96} />
            </div>
          </div>

          <section className="timeline-section">
            <div className="panel-heading">
              <div>
                <span className="section-kicker">
                  Incident log
                </span>
                <h2>Timeline</h2>
              </div>
            </div>

            <div className="timeline">
              <div>
                <i className="active" />
                <span>10:42 AM</span>
                <p>
                  <strong>
                    Emergency services on scene
                  </strong>
                  Confirmed by 3 nearby community members.
                </p>
              </div>

              <div>
                <i />
                <span>10:38 AM</span>
                <p>
                  <strong>Incident verified</strong>
                  Confidence passed the verified threshold.
                </p>
              </div>

              <div>
                <i />
                <span>10:35 AM</span>
                <p>
                  <strong>
                    Two corroborations received
                  </strong>
                  Smoke visible from Fulton Street.
                </p>
              </div>

              <div>
                <i />
                <span>10:31 AM</span>
                <p>
                  <strong>Initial report submitted</strong>
                  Reported by a verified community member.
                </p>
              </div>
            </div>
          </section>
        </section>

        <aside className="detail-aside">
          <div className="info-block">
            <span className="section-kicker">
              At a glance
            </span>

            <dl>
              <div>
                <dt>Status</dt>
                <dd>
                  <Status tone="red">Active</Status>
                </dd>
              </div>

              <div>
                <dt>Severity</dt>
                <dd>Critical</dd>
              </div>

              <div>
                <dt>Affected radius</dt>
                <dd>0.6 miles</dd>
              </div>

              <div>
                <dt>First reported</dt>
                <dd>10:31 AM</dd>
              </div>
            </dl>
          </div>

          <div className="info-block">
            <span className="section-kicker">
              Community evidence
            </span>

            <div className="evidence-count">
              <strong>14</strong>
              <span>corroborations</span>
            </div>

            <div className="avatar-row">
              <span>JP</span>
              <span>AM</span>
              <span>RL</span>
              <span>+11</span>
            </div>

            <button className="secondary-action">
              <Icon name="check" />
              I can corroborate
            </button>
          </div>

          <div className="alert-box">
            <Icon name="bell" />

            <div>
              <strong>Alert sent</strong>
              <span>
                1,284 people within the affected area
                were notified at 10:39 AM.
              </span>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

/* -------------------------------------------------------
   REPORT
------------------------------------------------------- */

function Report({ go }: { go: (view: View) => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [severity, setSeverity] = useState("Moderate");

  function submit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="success-state">
        <span className="success-icon">
          <Icon name="check" size={32} />
        </span>

        <span className="eyebrow">
          Report received
        </span>

        <h1>
          Thank you for helping your community.
        </h1>

        <p>
          Your report is being reviewed and compared
          with nearby activity. We’ll notify you when
          its status changes.
        </p>

        <div className="report-id">
          Report ID <strong>SIG-2049</strong>
        </div>

        <button
          className="primary-action"
          onClick={() => go("My Reports")}
        >
          Track my report <Icon name="arrow" />
        </button>
      </div>
    );
  }

  return (
    <div className="form-page">
      <PageTitle
        eyebrow="Community reporting"
        title="Report an emergency"
        description="Share what you’re seeing. Clear, accurate details help the community respond."
      />

      <div className="emergency-warning">
        <Icon name="alert" />

        <div>
          <strong>
            Is anyone in immediate danger?
          </strong>

          <span>
            Call your local emergency number first.
            Signal does not replace emergency services.
          </span>
        </div>

        <button>Call 911</button>
      </div>

      <form className="report-form" onSubmit={submit}>
        <fieldset>
          <legend>
            <span>01</span>
            What is happening?
          </legend>

          <div className="field-group">
            <label htmlFor="type">
              Emergency type
            </label>

            <select
              id="type"
              required
              defaultValue=""
            >
              <option value="" disabled>
                Select an incident type
              </option>
              <option>Fire or smoke</option>
              <option>Medical emergency</option>
              <option>Road hazard</option>
              <option>Utility outage</option>
              <option>Severe weather</option>
              <option>Other</option>
            </select>
          </div>

          <div className="field-group">
            <label htmlFor="description">
              Describe what you can see
            </label>

            <textarea
              id="description"
              required
              rows={5}
              placeholder="Include visible conditions, landmarks, and whether emergency services are present."
            />

            <small>
              Do not put yourself at risk to gather more
              information.
            </small>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <span>02</span>
            Where is it?
          </legend>

          <div className="location-input">
            <label
              className="field-group"
              htmlFor="location"
            >
              <span>Location</span>

              <input
                id="location"
                required
                defaultValue="8th Ave & Fulton Street"
              />
            </label>

            <button type="button">
              <Icon name="map" />
              Use my location
            </button>
          </div>

          <div className="mini-map">
            <MapView />
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <span>03</span>
            How severe is it?
          </legend>

          <div className="severity-options">
            {[
              "Low",
              "Moderate",
              "High",
              "Critical",
            ].map((item) => (
              <button
                type="button"
                onClick={() => setSeverity(item)}
                className={
                  severity === item
                    ? `selected severity-${item.toLowerCase()}`
                    : ""
                }
                key={item}
              >
                <i />
                {item}

                <small>
                  {item === "Low"
                    ? "Limited impact"
                    : item === "Moderate"
                    ? "Needs attention"
                    : item === "High"
                    ? "Serious impact"
                    : "Immediate danger"}
                </small>
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <span>04</span>
            Add a photo <em>Optional</em>
          </legend>

          <label className="upload-box">
            <Icon name="upload" size={24} />
            <strong>Upload a photo</strong>
            <span>
              JPG or PNG up to 10MB. Avoid identifiable
              faces.
            </span>

            <input
              type="file"
              accept="image/png,image/jpeg"
            />
          </label>
        </fieldset>

        <div className="form-actions">
          <span>
            By submitting, you confirm this report is
            accurate to the best of your knowledge.
          </span>

          <button
            className="primary-action"
            type="submit"
          >
            Submit report <Icon name="arrow" />
          </button>
        </div>
      </form>
    </div>
  );
}

/* -------------------------------------------------------
   ALERTS
------------------------------------------------------- */

function Alerts() {
  const [enabled, setEnabled] = useState(true);

  return (
    <>
      <PageTitle
        eyebrow="Your area"
        title="Alerts"
        description="Timely updates for incidents that may affect you."
        action={
          <label className="toggle-label">
            Nearby alerts

            <button
              role="switch"
              aria-checked={enabled}
              className={`toggle ${enabled ? "on" : ""}`}
              onClick={() => setEnabled(!enabled)}
            >
              <span />
            </button>
          </label>
        }
      />

      <div className="alerts-list">
        <article className="alert-item urgent">
          <div className="alert-icon">
            <Icon name="alert" />
          </div>

          <div className="alert-content">
            <div className="alert-meta">
              <Status tone="red">Critical</Status>
              <span>8 min ago</span>
            </div>

            <h2>
              Structure fire near Civic Center
            </h2>

            <p>
              Avoid 8th Avenue between Fulton and Grove.
              Emergency crews are on scene.
            </p>

            <div className="alert-data">
              <span>
                <b>0.8 mi</b> away
              </span>
              <span>
                <b>96%</b> confidence
              </span>
              <span>
                <b>Active</b> status
              </span>
            </div>
          </div>

          <button
            className="round-arrow"
            aria-label="View alert"
          >
            <Icon name="arrow" />
          </button>
        </article>

        <article className="alert-item">
          <div className="alert-icon amber">
            <Icon name="alert" />
          </div>

          <div className="alert-content">
            <div className="alert-meta">
              <Status tone="amber">Advisory</Status>
              <span>21 min ago</span>
            </div>

            <h2>
              Road obstruction on Harbor Parkway
            </h2>

            <p>
              Two eastbound lanes are blocked. Expect
              delays and use Market Street as an alternate
              route.
            </p>

            <div className="alert-data">
              <span>
                <b>1.4 mi</b> away
              </span>
              <span>
                <b>72%</b> confidence
              </span>
              <span>
                <b>Corroborating</b>
              </span>
            </div>
          </div>

          <button
            className="round-arrow"
            aria-label="View alert"
          >
            <Icon name="arrow" />
          </button>
        </article>

        <article className="alert-item resolved">
          <div className="alert-icon green">
            <Icon name="check" />
          </div>

          <div className="alert-content">
            <div className="alert-meta">
              <Status tone="green">Resolved</Status>
              <span>Yesterday</span>
            </div>

            <h2>
              Gas odor investigation concluded
            </h2>

            <p>
              Fire services have cleared the area. No
              ongoing hazard was found.
            </p>

            <div className="alert-data">
              <span>
                <b>3.6 mi</b> away
              </span>
              <span>
                <b>94%</b> confidence
              </span>
              <span>
                <b>Resolved</b>
              </span>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}

/* -------------------------------------------------------
   COMMUNITY
------------------------------------------------------- */

function Community() {
  return (
    <>
      <PageTitle
        eyebrow="People-powered safety"
        title="Community"
        description="A clear view of how neighbors are helping information become trustworthy."
      />

      <section className="community-hero">
        <div>
          <span className="section-kicker">
            Community impact · This week
          </span>

          <h2>
            Small actions create a clearer picture.
          </h2>

          <p>
            Every accurate report and corroboration helps
            Signal identify affected areas and get
            trustworthy information to the right people.
          </p>
        </div>

        <div className="community-number">
          <strong>1,248</strong>
          <span>community contributions</span>
        </div>
      </section>

      <div className="community-grid">
        <div className="community-stat">
          <span className="number">328</span>
          <h3>Reports submitted</h3>
          <p>
            Firsthand observations shared by nearby
            community members.
          </p>
          <span className="trend">
            ↑ 12% this week
          </span>
        </div>

        <div className="community-stat">
          <span className="number">894</span>
          <h3>Corroborations</h3>
          <p>
            Independent confirmations that increased
            report confidence.
          </p>
          <span className="trend">
            ↑ 18% this week
          </span>
        </div>

        <div className="community-stat">
          <span className="number">26</span>
          <h3>Incidents verified</h3>
          <p>
            Reports that reached Signal’s verification
            threshold.
          </p>
          <span className="trend">
            Average 6 min
          </span>
        </div>
      </div>

      <section className="panel contributor-table">
        <div className="panel-heading">
          <div>
            <span className="section-kicker">
              Recent contributions
            </span>
            <h2>Community activity</h2>
          </div>

          <button className="text-button">
            How verification works{" "}
            <Icon name="arrow" size={15} />
          </button>
        </div>

        {[
          "Amara corroborated a road obstruction|Harbor Parkway · 4 min ago|Trusted contributor",
          "Jon reported smoke from a building|Civic Center · 12 min ago|Report verified",
          "Priya confirmed power was restored|North Market · 28 min ago|Helpful update",
          "Luis shared an official road closure|West End · 41 min ago|Official source",
        ].map((row, i) => {
          const [main, meta, badge] =
            row.split("|");

          return (
            <div
              className="contribution-row"
              key={main}
            >
              <span className="avatar">
                {["AM", "JT", "PS", "LR"][i]}
              </span>

              <span>
                <strong>{main}</strong>
                <small>{meta}</small>
              </span>

              <Status
                tone={i === 1 ? "green" : "blue"}
              >
                {badge}
              </Status>
            </div>
          );
        })}
      </section>
    </>
  );
}

/* -------------------------------------------------------
   MY REPORTS
------------------------------------------------------- */

function MyReports({
  go,
}: {
  go: (view: View) => void;
}) {
  return (
    <>
      <PageTitle
        eyebrow="Your activity"
        title="My reports"
        description="Track reports you’ve submitted and updates you’ve shared."
        action={
          <button
            className="primary-action"
            onClick={() => go("Report")}
          >
            <Icon name="plus" />
            New report
          </button>
        }
      />

      <div className="my-report-summary">
        <div>
          <strong>4</strong>
          <span>Total reports</span>
        </div>

        <div>
          <strong>3</strong>
          <span>Verified</span>
        </div>

        <div>
          <strong>8</strong>
          <span>Corroborations</span>
        </div>

        <div>
          <strong>94%</strong>
          <span>Accuracy score</span>
        </div>
      </div>

      <section className="panel reports-table">
        <div className="table-head">
          <span>Incident</span>
          <span>Submitted</span>
          <span>Confidence</span>
          <span>Status</span>
          <span />
        </div>

        {incidents.slice(0, 3).map((item) => (
          <button
            className="table-row"
            key={item.id}
            onClick={() => go("Incident Detail")}
          >
            <span>
              <i className={`tiny-mark ${item.tone}`} />

              <span>
                <strong>{item.type}</strong>
                <small>{item.location}</small>
              </span>
            </span>

            <span>{item.time}</span>

            <span>{item.confidence}%</span>

            <span>
              <Status tone={item.tone}>
                {item.status}
              </Status>
            </span>

            <Icon name="arrow" size={16} />
          </button>
        ))}
      </section>
    </>
  );
}

/* -------------------------------------------------------
   SETTINGS
------------------------------------------------------- */

function Settings() {
  const [distance, setDistance] = useState("5 miles");

  return (
    <>
      <PageTitle
        eyebrow="Preferences"
        title="Settings"
        description="Choose how and when Signal keeps you informed."
      />

      <div className="settings-layout">
        <aside>
          <button className="active">
            Notifications
          </button>
          <button>Location & radius</button>
          <button>Privacy</button>
          <button>Accessibility</button>
        </aside>

        <section className="settings-panel">
          <h2>Notification preferences</h2>

          <p>
            Control the alerts you receive. Critical
            alerts in your immediate area are always
            prioritized.
          </p>

          {[
            "Critical incidents",
            "Verified incidents",
            "Emerging reports",
            "Incident updates",
          ].map((item, i) => (
            <div
              className="setting-row"
              key={item}
            >
              <div>
                <strong>{item}</strong>

                <span>
                  {
                    [
                      "Immediate threats and evacuation notices",
                      "Reports that pass community verification",
                      "Unverified reports gaining confidence",
                      "Status changes for incidents you follow",
                    ][i]
                  }
                </span>
              </div>

              <button
                role="switch"
                aria-checked={i !== 2}
                className={`toggle ${
                  i !== 2 ? "on" : ""
                }`}
              >
                <span />
              </button>
            </div>
          ))}

          <div className="setting-select">
            <label htmlFor="radius">
              Alert radius
            </label>

            <select
              id="radius"
              value={distance}
              onChange={(e) =>
                setDistance(e.target.value)
              }
            >
              <option>1 mile</option>
              <option>3 miles</option>
              <option>5 miles</option>
              <option>10 miles</option>
            </select>
          </div>

          <button className="primary-action">
            Save preferences
          </button>
        </section>
      </div>
    </>
  );
}

/* -------------------------------------------------------
   LOGIN
------------------------------------------------------- */

function Login({
  onLogin,
}: {
  onLogin: () => void;
}) {
  function submit(e: FormEvent) {
    e.preventDefault();
    onLogin();
  }

  return (
    <div className="login-page">
      <section className="login-intro">
        <div className="login-brand">
          <span className="brand-mark">S</span>
          <strong>Signal</strong>
        </div>

        <div className="login-message">
          <span className="eyebrow">
            Community emergency response
          </span>

          <h1>
            Clear information when it matters most.
          </h1>

          <p>
            Report emergencies, verify nearby incidents,
            and receive trustworthy alerts for the places
            and people you care about.
          </p>

          <div className="login-trust">
            <span>
              <Icon name="shield" />

              <span>
                <strong>Community verified</strong>
                <small>
                  Evidence-based confidence
                </small>
              </span>
            </span>

            <span>
              <Icon name="bell" />

              <span>
                <strong>Targeted alerts</strong>
                <small>
                  Only when they affect you
                </small>
              </span>
            </span>
          </div>
        </div>

        <p className="login-footnote">
          Helping communities see clearly and respond
          together.
        </p>
      </section>

      <section className="login-panel">
        <form
          className="login-form"
          onSubmit={submit}
        >
          <span className="eyebrow">
            Welcome back
          </span>

          <h2>Sign in to Signal</h2>

          <p>
            Access your local incident feed and
            community reports.
          </p>

          <label
            className="login-field"
            htmlFor="email"
          >
            <span>Email address</span>

            <input
              id="email"
              type="email"
              defaultValue="neel@example.com"
              autoComplete="email"
              required
            />
          </label>

          <label
            className="login-field"
            htmlFor="password"
          >
            <span>Password</span>

            <input
              id="password"
              type="password"
              defaultValue="signal123"
              autoComplete="current-password"
              required
            />
          </label>

          <div className="login-options">
            <label>
              <input
                type="checkbox"
                defaultChecked
              />
              Keep me signed in
            </label>

            <button type="button">
              Forgot password?
            </button>
          </div>

          <button
            className="primary-action login-submit"
            type="submit"
          >
            Sign in <Icon name="arrow" />
          </button>

          <div className="login-divider">
            <span>New to Signal?</span>
          </div>

          <button
            className="create-account"
            type="button"
          >
            Create an account
          </button>

          <p className="login-terms">
            By continuing, you agree to Signal’s Terms
            of Service and Privacy Policy.
          </p>
        </form>
      </section>
    </div>
  );
}

/* -------------------------------------------------------
   APP
------------------------------------------------------- */

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [view, setView] =
    useState<View>("Overview");
  const [mobileOpen, setMobileOpen] =
    useState(false);

  const go = (next: View) => {
    setView(next);
    setMobileOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const content =
    view === "Overview" ? (
      <Overview go={go} />
    ) : view === "Incidents" ? (
      <Incidents go={go} />
    ) : view === "Incident Detail" ? (
      <IncidentDetail go={go} />
    ) : view === "Report" ? (
      <Report go={go} />
    ) : view === "Alerts" ? (
      <Alerts />
    ) : view === "Community" ? (
      <Community />
    ) : view === "My Reports" ? (
      <MyReports go={go} />
    ) : (
      <Settings />
    );

  if (!loggedIn) {
    return (
      <Login
        onLogin={() => setLoggedIn(true)}
      />
    );
  }

  return (
    <div className="app-shell">
      <aside
        className={`sidebar ${
          mobileOpen ? "open" : ""
        }`}
      >
        <div className="brand">
          <span className="brand-mark">S</span>
          <strong>Signal</strong>

          <button
            className="mobile-close"
            aria-label="Close navigation"
            onClick={() =>
              setMobileOpen(false)
            }
          >
            <Icon name="close" />
          </button>
        </div>

        <nav>
          {navigation.map((item) => (
            <button
              key={item.label}
              onClick={() => go(item.label)}
              className={
                view === item.label ||
                (view === "Incident Detail" &&
                  item.label === "Incidents")
                  ? "active"
                  : ""
              }
            >
              <Icon name={item.icon} />

              <span>{item.label}</span>

              {item.label === "Alerts" && (
                <em>2</em>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="system-status">
            <i />

            <span>
              <strong>
                Systems operational
              </strong>

              <small>
                Updated just now
              </small>
            </span>
          </div>

          <button className="profile">
            <span>N</span>

            <span>
              <strong>Neel</strong>
              <small>Civic Center</small>
            </span>

            <b>•••</b>
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <button
          className="nav-scrim"
          aria-label="Close menu"
          onClick={() =>
            setMobileOpen(false)
          }
        />
      )}

      <main>
        <div className="mobile-header">
          <button
            aria-label="Open navigation"
            onClick={() =>
              setMobileOpen(true)
            }
          >
            <Icon name="menu" />
          </button>

          <div className="brand">
            <span className="brand-mark">S</span>
            <strong>Signal</strong>
          </div>

          <button aria-label="Notifications">
            <Icon name="bell" />
          </button>
        </div>

        <div className="content">
          {content}
        </div>
      </main>
    </div>
  );
}
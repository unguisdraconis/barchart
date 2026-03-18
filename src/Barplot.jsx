import { useMemo, useState } from "react";
import { scaleBand, scaleLinear, max } from "d3";

export default function Barplot({ data, width = 500, height = 400 }) {
  const [hoveredCountry, setHoveredCountry] = useState(null);

  const margin = { top: 40, right: 20, bottom: 30, left: 120 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const countries = useMemo(() => data.map((d) => d.country), [data]);

  const xMax = useMemo(() => max(data, (d) => d.students) ?? 0, [data]);

  const xScale = useMemo(
    () => scaleLinear().domain([0, xMax]).range([0, innerWidth]).nice(),
    [xMax, innerWidth],
  );

  const yScale = useMemo(
    () => scaleBand().domain(countries).range([0, innerHeight]).padding(0.2),
    [countries, innerHeight],
  );

  return (
    <>
      <svg
        width={width}
        height={height}
        role="img"
        aria-label="Student count by country"
      >
        <text
          x={width / 2}
          y={24}
          textAnchor="middle"
          fontSize={18}
          fontWeight={700}
          fill="var(--text-color)"
        >
          Students per Country
        </text>

        <g transform={`translate(${margin.left},${margin.top})`}>
          {data.map((d) => {
            const y = yScale(d.country) ?? 0;
            const barWidth = xScale(d.students);
            const isOtherHovered =
              hoveredCountry && hoveredCountry !== d.country;
            const opacity = isOtherHovered ? 0.3 : 1;

            return (
              <g
                key={d.country}
                onMouseEnter={() => setHoveredCountry(d.country)}
                onMouseLeave={() => setHoveredCountry(null)}
              >
                <rect
                  x={0}
                  y={y}
                  width={barWidth}
                  height={yScale.bandwidth()}
                  fill="var(--bar-fill)"
                  opacity={opacity}
                  rx={4}
                  style={{ transition: "opacity 300ms ease" }}
                />
                <text
                  x={-10}
                  y={y + yScale.bandwidth() / 2}
                  textAnchor="end"
                  dominantBaseline="middle"
                  fontSize={12}
                  fill="var(--text-color)"
                  opacity={opacity}
                  style={{ transition: "opacity 400ms ease" }}
                >
                  {d.country}
                </text>
                <text
                  x={barWidth + 8}
                  y={y + yScale.bandwidth() / 2}
                  dominantBaseline="middle"
                  fontSize={12}
                  fill="var(--text-color)"
                  opacity={opacity}
                  style={{ transition: "opacity 300ms ease" }}
                >
                  {d.students}
                </text>
              </g>
            );
          })}

          {/* X axis line */}
          <line
            x1={0}
            y1={innerHeight}
            x2={innerWidth}
            y2={innerHeight}
            stroke="var(--axis-stroke)"
          />
        </g>
      </svg>

      <div
        style={{
          marginTop: 12,
          fontSize: 8,
          color: "var(--text-muted)",
          textAlign: "center",
          marginLeft: 180,
        }}
      >
        By Jeremiah King using GitHub Copilot · Model: Raptor mini (Preview) ·
        2026
      </div>
    </>
  );
}

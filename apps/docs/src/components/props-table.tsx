export type PropDef = {
  name: string;
  type: string;
  defaultValue?: string;
  description: string;
};

type PropsTableProps = {
  props: PropDef[];
};

export const PropsTable = ({ props: rows }: PropsTableProps) => (
  <div className="docs-props-wrap">
    <table className="docs-props">
      <thead>
        <tr>
          <th>Prop</th>
          <th>Type</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.name}>
            <td>
              <code>{row.name}</code>
            </td>
            <td>
              <code>{row.type}</code>
            </td>
            <td>{row.defaultValue ? <code>{row.defaultValue}</code> : "—"}</td>
            <td>{row.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

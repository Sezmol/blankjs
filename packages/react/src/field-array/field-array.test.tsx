import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import { FieldArray } from "./index";
import { Field } from "../field";
import { Form } from "../form";
import { TextInput } from "../text-input";

interface User {
  email: string;
}

const makeSchema = (
  validate: StandardSchemaV1["~standard"]["validate"],
): StandardSchemaV1 => ({
  "~standard": { version: 1, vendor: "blankjs-test", validate },
});

const passthrough = makeSchema((value) => ({ value }));

const UserList = ({
  defaultItems,
  minItems,
  maxItems,
  onSubmit,
  schema = passthrough,
  errors,
}: {
  defaultItems?: User[];
  minItems?: number;
  maxItems?: number;
  onSubmit?: (data: unknown) => void;
  schema?: StandardSchemaV1;
  errors?: Record<string, string>;
}) => (
  <Form schema={schema} onSubmit={onSubmit} errors={errors}>
    <FieldArray<User>
      name="users"
      defaultItems={defaultItems}
      minItems={minItems}
      maxItems={maxItems}
    >
      {({ rows }) => (
        <>
          {rows.map((row) => (
            <div key={row.key}>
              <Field.Root name={row.name("email")}>
                <Field.Label>Email {row.position}</Field.Label>
                <TextInput
                  name={row.name("email")}
                  defaultValue={row.item?.email}
                />
                <Field.Error />
              </Field.Root>
              <FieldArray.Remove row={row}>
                Remove {row.position}
              </FieldArray.Remove>
            </div>
          ))}
          <FieldArray.Add>Add</FieldArray.Add>
          <FieldArray.Error />
        </>
      )}
    </FieldArray>
    <button type="submit">Go</button>
  </Form>
);

const emails = () =>
  screen
    .getAllByRole("textbox")
    .map((input) => (input as HTMLInputElement).value);

test("renders one empty row by default", () => {
  render(<UserList />);

  expect(screen.getAllByRole("textbox")).toHaveLength(1);
});

test("names inputs by position and renumbers them after a removal", async () => {
  const user = userEvent.setup();

  render(<UserList defaultItems={[{ email: "a" }, { email: "b" }]} />);

  expect(screen.getByLabelText("Email 1")).toHaveAttribute(
    "name",
    "users[0].email",
  );

  await user.click(screen.getByRole("button", { name: "Remove 1" }));

  expect(screen.getByLabelText("Email 1")).toHaveAttribute(
    "name",
    "users[0].email",
  );
});

test("keeps the typed value with its row when a row above is removed", async () => {
  const user = userEvent.setup();

  render(<UserList defaultItems={[{ email: "a" }, { email: "b" }]} />);

  await user.type(screen.getByLabelText("Email 2"), "!");

  expect(emails()).toEqual(["a", "b!"]);

  await user.click(screen.getByRole("button", { name: "Remove 1" }));

  expect(emails()).toEqual(["b!"]);
});

test("submits the rows as an array of objects", async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();

  render(
    <UserList
      onSubmit={onSubmit}
      defaultItems={[{ email: "a@x.dev" }, { email: "b@x.dev" }]}
    />,
  );

  await user.click(screen.getByRole("button", { name: "Go" }));

  await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));

  expect(onSubmit.mock.calls[0]![0]).toEqual({
    users: [{ email: "a@x.dev" }, { email: "b@x.dev" }],
  });
});

test("routes a schema issue to the row it belongs to", async () => {
  const schema = makeSchema(() => ({
    issues: [{ message: "Bad email", path: ["users", 1, "email"] }],
  }));

  render(
    <UserList
      schema={schema}
      onSubmit={vi.fn()}
      defaultItems={[{ email: "a" }, { email: "b" }]}
    />,
  );

  fireEvent.click(screen.getByRole("button", { name: "Go" }));

  expect(await screen.findByText("Bad email")).toBeInTheDocument();
  expect(screen.getByLabelText("Email 2")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  expect(screen.getByLabelText("Email 1")).not.toHaveAttribute("aria-invalid");
});

test("shows an issue raised on the array itself", async () => {
  const schema = makeSchema(() => ({
    issues: [{ message: "At least two people", path: ["users"] }],
  }));

  render(<UserList schema={schema} onSubmit={vi.fn()} />);

  fireEvent.click(screen.getByRole("button", { name: "Go" }));

  const error = await screen.findByText("At least two people");

  expect(screen.getByRole("group")).toHaveAttribute(
    "aria-describedby",
    error.id,
  );
});

test("drops stale row errors when the list changes", async () => {
  const user = userEvent.setup();
  const schema = makeSchema(() => ({
    issues: [{ message: "Bad email", path: ["users", 1, "email"] }],
  }));

  render(
    <UserList
      schema={schema}
      onSubmit={vi.fn()}
      defaultItems={[{ email: "a" }, { email: "b" }]}
    />,
  );

  fireEvent.click(screen.getByRole("button", { name: "Go" }));

  expect(await screen.findByText("Bad email")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Remove 1" }));

  expect(screen.queryByText("Bad email")).toBeNull();
});

test("keeps row errors when a row is appended", async () => {
  const user = userEvent.setup();
  const schema = makeSchema(() => ({
    issues: [{ message: "Bad email", path: ["users", 0, "email"] }],
  }));

  render(<UserList schema={schema} onSubmit={vi.fn()} />);

  fireEvent.click(screen.getByRole("button", { name: "Go" }));

  expect(await screen.findByText("Bad email")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Add" }));

  // appending renumbers nothing, so the message is still about row 1
  expect(screen.getByText("Bad email")).toBeInTheDocument();
});

test("drops row errors when a row is moved through the render prop", async () => {
  const user = userEvent.setup();
  const schema = makeSchema(() => ({
    issues: [{ message: "Bad email", path: ["users", 1, "email"] }],
  }));

  render(
    <Form schema={schema} onSubmit={vi.fn()}>
      <FieldArray<User> name="users" defaultItems={[{ email: "a" }, { email: "b" }]}>
        {({ rows, move }) => (
          <>
            {rows.map((row) => (
              <div key={row.key}>
                <Field.Root name={row.name("email")}>
                  <Field.Label>Email {row.position}</Field.Label>
                  <TextInput name={row.name("email")} defaultValue={row.item?.email} />
                  <Field.Error />
                </Field.Root>
                <button type="button" onClick={() => move(row.key, 1)}>
                  Promote {row.position}
                </button>
              </div>
            ))}
          </>
        )}
      </FieldArray>
      <button type="submit">Go</button>
    </Form>,
  );

  fireEvent.click(screen.getByRole("button", { name: "Go" }));

  expect(await screen.findByText("Bad email")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Promote 2" }));

  expect(screen.queryByText("Bad email")).toBeNull();
});

test("lets a consumer override the group role", () => {
  render(
    <Form>
      <FieldArray name="users" role="list">
        {() => null}
      </FieldArray>
    </Form>,
  );

  expect(screen.getByRole("list")).toBeInTheDocument();
});

test("moves focus into the row it just added", async () => {
  const user = userEvent.setup();

  render(<UserList />);

  await user.click(screen.getByRole("button", { name: "Add" }));

  expect(screen.getByLabelText("Email 2")).toHaveFocus();
});

test("moves focus to the next remove button after a removal", async () => {
  const user = userEvent.setup();

  render(
    <UserList defaultItems={[{ email: "a" }, { email: "b" }, { email: "c" }]} />,
  );

  await user.click(screen.getByRole("button", { name: "Remove 1" }));

  expect(screen.getByRole("button", { name: "Remove 1" })).toHaveFocus();
});

test("falls back to the last remove button when the last row goes", async () => {
  const user = userEvent.setup();

  render(<UserList defaultItems={[{ email: "a" }, { email: "b" }]} />);

  await user.click(screen.getByRole("button", { name: "Remove 2" }));

  expect(screen.getByRole("button", { name: "Remove 1" })).toHaveFocus();
});

test("skips a remove button that minItems just disabled", async () => {
  const user = userEvent.setup();

  render(
    <UserList defaultItems={[{ email: "a" }, { email: "b" }]} minItems={1} />,
  );

  await user.click(screen.getByRole("button", { name: "Remove 2" }));

  expect(screen.getByRole("button", { name: "Remove 1" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Add" })).toHaveFocus();
});

test("leaves focus alone when the removal came from outside the row", async () => {
  const user = userEvent.setup();

  render(<UserList defaultItems={[{ email: "a" }, { email: "b" }]} />);

  const input = screen.getByLabelText("Email 1");

  await user.click(input);

  fireEvent.click(screen.getByRole("button", { name: "Remove 2" }));

  expect(input).toHaveFocus();
});

test("disables add at maxItems and remove at minItems", async () => {
  const user = userEvent.setup();

  render(<UserList minItems={1} maxItems={2} />);

  expect(screen.getByRole("button", { name: "Remove 1" })).toBeDisabled();

  await user.click(screen.getByRole("button", { name: "Add" }));

  expect(screen.getByRole("button", { name: "Add" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Remove 1" })).toBeEnabled();
});

test("restores the seeded rows on form reset", async () => {
  const user = userEvent.setup();

  render(
    <Form>
      <FieldArray<User> name="users" defaultItems={[{ email: "a" }]}>
        {({ rows }) => (
          <>
            {rows.map((row) => (
              <div key={row.key}>
                <TextInput
                  aria-label={`Email ${row.position}`}
                  name={row.name("email")}
                  defaultValue={row.item?.email}
                />
              </div>
            ))}
            <FieldArray.Add>Add</FieldArray.Add>
          </>
        )}
      </FieldArray>
      <button type="reset">Reset</button>
    </Form>,
  );

  await user.click(screen.getByRole("button", { name: "Add" }));

  expect(screen.getAllByRole("textbox")).toHaveLength(2);

  await user.click(screen.getByRole("button", { name: "Reset" }));

  expect(screen.getAllByRole("textbox")).toHaveLength(1);
});

test("scopes buttons and names to its own array when nested", async () => {
  const user = userEvent.setup();

  render(
    <Form>
      <FieldArray name="users">
        {({ rows }) => (
          <>
            {rows.map((row) => (
              <div key={row.key}>
                <FieldArray name={row.name("phones")}>
                  {(phones) => (
                    <>
                      {phones.rows.map((phone) => (
                        <div key={phone.key}>
                          <TextInput
                            aria-label={`Phone ${phone.position}`}
                            name={phone.name()}
                          />
                          <FieldArray.Remove row={phone}>
                            Drop phone {phone.position}
                          </FieldArray.Remove>
                        </div>
                      ))}
                      <FieldArray.Add>Add phone</FieldArray.Add>
                    </>
                  )}
                </FieldArray>
                <FieldArray.Remove row={row}>Drop user</FieldArray.Remove>
              </div>
            ))}
          </>
        )}
      </FieldArray>
    </Form>,
  );

  await user.click(screen.getByRole("button", { name: "Add phone" }));

  expect(screen.getByLabelText("Phone 2")).toHaveAttribute(
    "name",
    "users[0].phones[1]",
  );
  expect(screen.getByLabelText("Phone 2")).toHaveFocus();
});

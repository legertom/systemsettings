import type { JsonValue, Scenario } from "@/lib/types";

const cleverSettingsDemo: JsonValue = {
  settings: {
    authorized_keys: null,
    blacklisted_schools: null,
    create_sections: null,
    exports: {
      Attendance: { fields: null, filters: [], params: null },
      CC: { fields: ["School_id", "Section_id", "Student_id"], filters: [], params: null },
      DistrictAdmins: {
        fields: ["Admin_id", "Admin_email", "First_name", "Last_name", "Title", "Role"],
        filters: [],
        params: null,
      },
    },
    field_whitelist: null,
    next_school_year: { begins: null, ends: null },
    pause: { begins: null, ends: null },
    school_ids_list: null,
    school_year: { begins: null, ends: null },
    sftp_owner: "school",
    sis_type: "other",
    sql_spec: { enabled: false, dialect: "postgres", query: null },
  },
};

export const seedScenarios: Scenario[] = [
  {
    id: "clever-demo-exports",
    title: "Clever Demo: Basic exports",
    description:
      "Practice navigating nested settings and making a small, safe edit to an export configuration.",
    instructions: [
      'Switch to "Tree" mode.',
      'Under `settings.exports.CC.fields`, add a new field: `Student_number`.',
      "Do not remove any existing fields.",
      'Click "Save System Settings" to check your work.',
    ],
    initialJson: cleverSettingsDemo,
    checks: [
      {
        id: "cc-fields-is-array",
        label: "`settings.exports.CC.fields` is an array",
        hint: "In Tree mode, make sure `fields` uses the Array type (`[]`).",
        path: "settings.exports.CC.fields",
        op: "typeIs",
        expected: "array",
      },
      {
        id: "cc-fields-includes-student-number",
        label: "`Student_number` is present in `settings.exports.CC.fields`",
        hint: "Add `Student_number` to the `fields` list under the `CC` export.",
        path: "settings.exports.CC.fields",
        op: "includes",
        expected: "Student_number",
      },
    ],
  },
];

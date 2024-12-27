export type Timezone = {
  label: string
  value: string
  description: string
}

export function getTimezoneByLabel(label: string): Timezone {
  const timezone = timezones.find((t) => t.label === label)

  if (!timezone) throw new Error(`Timezone not found for label ${label}`)

  return timezone
}

export function getTimezoneByValue(value: string): Timezone {
  const timezone = timezones.find((t) => t.value === value)

  if (!timezone) throw new Error(`Timezone not found for value ${value}`)

  return timezone
}

export const timezones: Timezone[] = [
  {
    label: "Pacific/Baker Island",
    value: "UTC-12:00",
    description: "Baker Island",
  },
  {
    label: "Pacific/Midway",
    value: "UTC-11:00",
    description: "Midway Island, Samoa",
  },
  {
    label: "Pacific/Honolulu",
    value: "UTC-10:00",
    description: "Hawaii",
  },
  {
    label: "America/Anchorage",
    value: "UTC-09:00",
    description: "Alaska",
  },
  {
    label: "America/Los Angeles",
    value: "UTC-08:00",
    description: "Pacific Time (US & Canada)",
  },
  {
    label: "America/Denver",
    value: "UTC-07:00",
    description: "Mountain Time (US & Canada)",
  },
  {
    label: "America/Chicago",
    value: "UTC-06:00",
    description: "Central Time (US & Canada)",
  },
  {
    label: "America/New York",
    value: "UTC-05:00",
    description: "Eastern Time (US & Canada)",
  },
  {
    label: "America/Halifax",
    value: "UTC-04:00",
    description: "Atlantic Time (Canada)",
  },
  {
    label: "America/Sao Paulo",
    value: "UTC-03:00",
    description: "São Paulo, Buenos Aires",
  },
  {
    label: "America/Noronha",
    value: "UTC-02:00",
    description: "Fernando de Noronha",
  },
  {
    label: "Atlantic/Cape Verde",
    value: "UTC-01:00",
    description: "Cape Verde Islands",
  },
  {
    label: "Europe/London",
    value: "UTC+00:00",
    description: "London, Dublin, Lisbon",
  },
  {
    label: "Europe/Paris",
    value: "UTC+01:00",
    description: "Paris, Amsterdam, Berlin, Rome",
  },
  {
    label: "Europe/Helsinki",
    value: "UTC+02:00",
    description: "Helsinki, Cairo, Jerusalem",
  },
  {
    label: "Asia/Baghdad",
    value: "UTC+03:00",
    description: "Moscow, Baghdad, Kuwait",
  },
  {
    label: "Asia/Dubai",
    value: "UTC+04:00",
    description: "Dubai, Abu Dhabi",
  },
  {
    label: "Asia/Karachi",
    value: "UTC+05:00",
    description: "Karachi, Tashkent",
  },
  {
    label: "Asia/Kolkata",
    value: "UTC+05:30",
    description: "Mumbai, New Delhi",
  },
  {
    label: "Asia/Dhaka",
    value: "UTC+06:00",
    description: "Dhaka, Almaty",
  },
  {
    label: "Asia/Bangkok",
    value: "UTC+07:00",
    description: "Bangkok, Jakarta",
  },
  {
    label: "Asia/Shanghai",
    value: "UTC+08:00",
    description: "Beijing, Singapore, Hong Kong",
  },
  {
    label: "Asia/Tokyo",
    value: "UTC+09:00",
    description: "Tokyo, Seoul",
  },
  {
    label: "Australia/Sydney",
    value: "UTC+10:00",
    description: "Sydney, Melbourne",
  },
  {
    label: "Pacific/Noumea",
    value: "UTC+11:00",
    description: "New Caledonia",
  },
  {
    label: "Pacific/Auckland",
    value: "UTC+12:00",
    description: "Auckland, Wellington",
  },
]

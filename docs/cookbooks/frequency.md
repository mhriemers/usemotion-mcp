# Frequency

## Days

Defining days should always be used along with a specific frequency type as defined below. An array of days should never be used on its own. See examples below.

When picking a set of specific week days, we expect it to be defined as an array with a subset of the following values.

- **MO** - Monday
- **TU** - Tuesday
- **WE** - Wednesday
- **TH** - Thursday
- **FR** - Friday
- **SA** - Saturday
- **SU** - Sunday

For example, `[MO, FR, SU]` would mean Monday, Friday, and Sunday.

## Defining a Daily Frequency

- `daily_every_day`
- `daily_every_week_day`
- `daily_specific_days_DAYS_ARRAY`

For example, `daily_specific_days_[MO, TU, FR]` means every Monday, Tuesday, and Friday.

## Defining a Weekly Frequency

- `weekly_any_day`
- `weekly_any_week_day`
- `weekly_specific_days_DAYS_ARRAY`

For example, `weekly_specific_days_[MO, TU, FR]` means once a week, on Monday, Tuesday or Friday.

## Defining a Bi-Weekly Frequency

- `biweekly_first_week_specific_days_DAYS_ARRAY`
- `biweekly_first_week_any_day`
- `biweekly_first_week_any_week_day`
- `biweekly_second_week_any_day`
- `biweekly_second_week_any_week_day`

For example, `biweekly_first_week_specific_days_[MO, TU, FR]` means biweekly on the first week, on Mondays, Tuesdays or Fridays.

## Defining a Monthly Frequency

### Specific Week Day Options

When choosing the 1st, 2nd, 3rd, 4th or last day of the week for the month, it takes the form of any of the following where `DAY` can be substituted for the day code mentioned above.

- `monthly_first_DAY`
- `monthly_second_DAY`
- `monthly_third_DAY`
- `monthly_fourth_DAY`
- `monthly_last_DAY`

For example, `monthly_first_MO` means the first Monday of the month.

### Specific Day Options

In the case you choose a numeric value for a month that does not have that many days, we will default to the last day of the month.

When choosing a specific day of the month, for example the 6th, it would be defined with just the number like below.

- `monthly_1`
- `monthly_15`
- `monthly_31`

### Specific Week Options

**Any Day**

- `monthly_any_day_first_week`
- `monthly_any_day_second_week`
- `monthly_any_day_third_week`
- `monthly_any_day_fourth_week`
- `monthly_any_day_last_week`

**Any Week Day**

- `monthly_any_week_day_first_week`
- `monthly_any_week_day_second_week`
- `monthly_any_week_day_third_week`
- `monthly_any_week_day_fourth_week`
- `monthly_any_week_day_last_week`

### Other Options

- `monthly_last_day_of_month`
- `monthly_any_week_day_of_month`
- `monthly_any_day_of_month`

## Defining a Quarterly Frequency

### First Days

- `quarterly_first_day`
- `quarterly_first_week_day`
- `quarterly_first_DAY`

For example, `quarterly_first_MO` means the first Monday of the quarter.

### Last Days

- `quarterly_last_day`
- `quarterly_last_week_day`
- `quarterly_last_DAY`

For example, `quarterly_last_MO` means the last Monday of the quarter.

### Other Options

- `quarterly_any_day_first_week`
- `quarterly_any_day_second_week`
- `quarterly_any_day_last_week`
- `quarterly_any_day_first_month`
- `quarterly_any_day_second_month`
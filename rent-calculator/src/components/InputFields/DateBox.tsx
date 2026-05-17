import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/en-gb";
import { createTheme } from "@mui/material/styles";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import { ThemeProvider } from "@mui/material/styles";
import { DateBoxProps } from "@/src/types/InputFields";
import { fluidCSSWidthScale } from "@/src/utils/HelperFunctions";
import { DATE_BOX_HEIGHT, DATE_BOX_WIDTH, MAX_TEXT_BOX_WIDTH_SCALE, MIN_TEXT_BOX_WIDTH_SCALE } from "./inputFieldConsts";

const dateTheme = createTheme({
    breakpoints: {
        unit:"rem",
        values: {
            xs: 0,
            sm: 40,
            md: 48,
            lg: 64,
            xl: 80,
        },
    },
    components: {
        MuiPickersOutlinedInput: {
            styleOverrides: {
                root:({theme}) => ({
                    borderRadius: "1rem",
                    backgroundColor: "#364153",
                    color: "#e5e7eb",
                    fontSize: "1rem",
                    lineHeight: 1.5,
                    height: `${DATE_BOX_HEIGHT - 0.5}rem`,

                    width: fluidCSSWidthScale(`${DATE_BOX_WIDTH * MIN_TEXT_BOX_WIDTH_SCALE}rem`,`${DATE_BOX_WIDTH}rem`, `${DATE_BOX_WIDTH*MAX_TEXT_BOX_WIDTH_SCALE}rem`), 

                    [theme.breakpoints.up("md")]:{
                        fontSize: "1.125rem",
                        lineHeight: 1.75 / 1.125,
                        height: `${DATE_BOX_HEIGHT - 0.25}rem`,
                    },

                    [theme.breakpoints.up("lg")]: {
                        fontSize: "1.5rem",
                        lineHeight: 2 / 1.5,
                        height: `${DATE_BOX_HEIGHT}rem`,
                    },

                    "& input":{
                        font: "inherit",
                    },

                    transition: "background-color 200ms ease, color 200ms ease",

                    // default outline
                    "& .MuiPickersOutlinedInput-notchedOutline": {
                        borderColor: "#d1d5dc",
                        borderWidth: "2px",
                    },

                    // default icon
                    "& .MuiInputAdornment-root .MuiSvgIcon-root": {
                        color: "#e5e7eb",
                    },

                    // error
                    "&.Mui-error": {
                        // outline
                        "& .MuiPickersOutlinedInput-notchedOutline": {
                            borderColor: "oklch(57.7% 0.245 27.325)",
                        },
                        // icon
                        "& .MuiInputAdornment-root .MuiSvgIcon-root": {
                            color: "oklch(57.7% 0.245 27.325)",
                        },
                    },

                    // focused
                    "&.Mui-focused": {
                        backgroundColor: "#101828",
                        color: "#f9fafb",
                        "&:not(.Mui-error)": {
                            "& .MuiPickersOutlinedInput-notchedOutline": {
                                borderColor: "#f9fafb",
                            },
                            "& .MuiInputAdornment-root .MuiSvgIcon-root": {
                                color: "#a800b7",
                            },
                        },

                        "&.Mui-error": {
                            //outline
                            "& .MuiPickersOutlinedInput-notchedOutline": {
                                borderColor: "#fb2c36",
                            },
                            // icon
                            "& .MuiInputAdornment-root .MuiSvgIcon-root": {
                                color: "#fb2c36",
                            },
                        },
                    },

                    // hover
                    "&:hover:not(.Mui-focused)": {
                        backgroundColor: "#1e2939",
                        color: "#f3f4f6",

                        "& .MuiPickersOutlinedInput-notchedOutline": {
                            borderColor: "#f3f4f6",
                        },

                        "& .MuiInputAdornment-root .MuiSvgIcon-root": {
                            color: "#f3f4f6",
                        },

                        "&.Mui-error": {
                            //outline
                            "& .MuiPickersOutlinedInput-notchedOutline": {
                                borderColor: "#fb2c36",
                            },
                            // icon
                            "& .MuiInputAdornment-root .MuiSvgIcon-root": {
                                color: "#fb2c36",
                            },
                        },
                    },
                }),
                
            },
        },

        MuiPickersInputBase: {
            styleOverrides: {
                root: {
                padding: "0 0.75rem !important",
                },
            },
        },

        MuiPickerPopper: {
            styleOverrides: {
                root: {},
                paper: {
                    borderRadius: "1rem",
                    backgroundColor: "#1e2939",
                    border: "2px solid",
                    borderColor: "#f9fafb",
                },
            },
        },

        MuiPickersArrowSwitcher: {
            styleOverrides: {
                button: {
                    transition: "color 200ms ease",
                    color: "#e5e7eb",
                    "&:hover": {
                        color: "#f9fafb",
                    },
                },
            },
        },

        MuiPickersCalendarHeader: {
            styleOverrides: {
                label: {
                    transition: "color 200ms ease",
                    color: "#e5e7eb",
                    "&:hover": {
                        color: "#f9fafb",
                    },
                },

                switchViewIcon: {
                    transition: "color 200ms ease",
                    color: "#e5e7eb",
                    "&:hover": {
                        color: "#f9fafb",
                    },
                },
            },
        },

        MuiPickersDay: {
            styleOverrides: {
                root: {
                    transition: "background-color 200ms ease, color 200ms ease",
                    color: "#e5e7eb",

                    "&.MuiButtonBase-root": {
                        "&.Mui-selected": {
                            color: "#f9fafb",
                            backgroundColor: "#a800b7",
                            "&:hover": {
                                backgroundColor: "#8a0194",
                            },

                            "&.Mui-focusVisible": {
                                backgroundColor: "#8a0194",
                            },
                        },

                        "&:hover:not(.Mui-selected)": {
                            backgroundColor: "rgba(168, 0, 183, 0.25)",
                        },

                        "&.Mui-disabled": {
                            color: "#364153",
                            opacity: 0.5,
                        },
                    },
                },

                dayOutsideMonth: {
                    color: "#99a1af",
                    opacity: 0.6,
                },

                today: {
                    "&:not(.Mui-selected)": {
                        border: "2px solid",
                        borderColor: "#a800b7",
                    },
                },
            },
        },

        MuiDayCalendar: {
            styleOverrides: {
                weekDayLabel: {
                    color: "#f9fafb",
                },
            },
        },

        MuiYearCalendar: {
            styleOverrides: {
                button: {
                    transition: "background-color 200ms ease, color 200ms ease",
                    color: "#e5e7eb",

                    "&.Mui-selected": {
                        color: "#f9fafb",
                        backgroundColor: "#a800b7 !important",

                        "&:hover": {
                            backgroundColor: "#8a0194",
                        },
                    },

                    "&.Mui-focusVisible": {
                        color: "#f9fafb",
                        backgroundColor: "#a800b7 !important",
                    },

                    "&:hover:not(.Mui-selected)": {
                        backgroundColor: "rgba(168, 0, 183, 0.25)",
                    },

                    "&[aria-current='date']:not(.Mui-selected)": {
                        color: "#a800b7",
                        backgroundColor: "transparent",

                        "&:hover": {
                            color: "#d1d5dc",
                            backgroundColor: "rgba(168, 0, 183, 0.25)",
                        },
                    },
                },
            },
        },
    },
});

function DateBox(props: DateBoxProps) {
    const { label, alignment = "left", onChange, controlled } = props;
    const alignmentMap = {
        left: "text-left",
        center: "text-center",
        right: "text-right",
    };
    return (
        <ThemeProvider theme={dateTheme}>
            <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="en-gb"
            >
                <label className="flex flex-col font-normal focus-within:font-semibold focus-within:text-gray-50 transition-colors">
                    <span
                        className={`text-gray-200 whitespace-nowrap ${alignmentMap[alignment]} text-base md:text-lg lg:text-2xl hover:text-gray-100 mb-2 cursor-pointer`}
                    >
                        {label}
                    </span>
                    <DatePicker
                        onChange={(value, context) => {
                            if (controlled) {
                                props.setValue(value);
                            }

                            if (context.validationError == null) {
                                if (onChange !== undefined) {
                                    onChange(value);
                                }
                            }
                        }}
                        {...(props.minDate && { minDate: props.minDate })}
                        {...(props.controlled && { value: props.value })}
                        {...(props.onError && { onError: props.onError })}
                        slotProps={{
                            day: {
                                showDaysOutsideCurrentMonth: true,
                            },

                            popper: {
                                modifiers: [
                                    {
                                        name: "offset",
                                        options: {
                                            offset: [0, 6],
                                        },
                                    },
                                ],
                            },

                            textField: {
                                variant: "outlined",
                                error:
                                    props.valid !== undefined
                                        ? !props.valid
                                        : undefined,
                                sx: {},
                            },
                        }}
                    ></DatePicker>
                </label>
            </LocalizationProvider>
        </ThemeProvider>
    );
}

export default DateBox;

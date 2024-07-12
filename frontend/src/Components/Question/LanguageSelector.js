import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function BasicSelect({ language, setLanguage }) {
  return (
    <Box sx={{ minWidth: 120, maxWidth: 200, mx: "auto", mt: 2, mb: 2 }}>
      <FormControl fullWidth variant="outlined" size="small">
        <InputLabel
          id="language-select-label"
          sx={{ color: "#e8e7e6", "&.Mui-focused": { color: "#e8e7e6" } }}
        >
          Language
        </InputLabel>
        <Select
          labelId="language-select-label"
          id="language-select"
          value={language}
          label="Language"
          onChange={(e) => setLanguage(e.target.value)}
          sx={{
            "& .MuiSelect-select": {
              display: "flex",
              alignItems: "center",
              padding: "8px 14px",
              color: "#e8e7e6",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#e8e7e6",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#e8e7e6",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#e8e7e6",
            },
          }}
        >
          <MenuItem value={"py"}>Python</MenuItem>
          <MenuItem value={"java"}>Java</MenuItem>
          <MenuItem value={"cpp"}>C++</MenuItem>
          <MenuItem value={"c"}>C</MenuItem>
          <MenuItem value={"go"}>GoLang</MenuItem>
          <MenuItem value={"cs"}>c#</MenuItem>
          <MenuItem value={"js"}>JavaScript</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

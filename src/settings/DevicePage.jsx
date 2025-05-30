import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  FormControlLabel,
  Checkbox,
  TextField,
} from "@mui/material";
import { DropzoneArea } from "react-mui-dropzone";
import EditItemView from "./components/EditItemView";
import EditAttributesAccordion from "./components/EditAttributesAccordion";
import SelectField from "../common/components/SelectField";
import deviceCategories from "../common/util/deviceCategories";
import { useTranslation } from "../common/components/LocalizationProvider";
import useDeviceAttributes from "../common/attributes/useDeviceAttributes";
import { useAdministrator } from "../common/util/permissions";
import SettingsMenu from "./components/SettingsMenu";
import useCommonDeviceAttributes from "../common/attributes/useCommonDeviceAttributes";
import { useCatch } from "../reactHelper";
import useQuery from "../common/util/useQuery";
import useSettingsStyles from "./common/useSettingsStyles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

const DevicePage = () => {
  const classes = useSettingsStyles();
  const t = useTranslation();

  const admin = useAdministrator();

  const commonDeviceAttributes = useCommonDeviceAttributes(t);
  const deviceAttributes = useDeviceAttributes(t);

  const query = useQuery();
  const uniqueId = query.get("uniqueId");

  const [item, setItem] = useState(uniqueId ? { uniqueId } : null);

  const [backgroundColor, setBackgroundColor] = useState("#000000");
  const [textColor, setTextColor] = useState("#ffffff");
  const [secondaryColor, setSecondaryColor] = useState("#000000");
  const [iconColor, setIconColor] = useState("#ffffff");

  useEffect(() => {
    const reportColor = item?.attributes?.deviceColors;
    if (reportColor) {
      const { background, text, icon, secondary } = reportColor;
      setBackgroundColor(background);
      setTextColor(text);
      setSecondaryColor(secondary);
      setIconColor(icon);
    }
  }, [item]);

  const handleFiles = useCatch(async (files) => {
    if (files.length > 0) {
      const response = await fetch(`/api/devices/${item.id}/image`, {
        method: "POST",
        body: files[0],
      });
      if (response.ok) {
        setItem({
          ...item,
          attributes: {
            ...item.attributes,
            deviceImage: await response.text(),
          },
        });
      } else {
        throw Error(await response.text());
      }
    }
  });

  const validate = () => item && item.name && item.uniqueId;

  return (
    <EditItemView
      endpoint="devices"
      item={item}
      setItem={setItem}
      validate={validate}
      menu={<SettingsMenu />}
      breadcrumbs={["settingsTitle", "sharedDevice"]}
      backgroundColor={backgroundColor}
      textColor={textColor}
      secondaryColor={secondaryColor}
      iconColor={iconColor}
    >
      {item && (
        <>
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<FontAwesomeIcon icon={faAngleDown} />}
            >
              <Typography variant="subtitle1">{t("sharedRequired")}</Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.details}>
              <TextField
                value={item.name || ""}
                onChange={(event) =>
                  setItem({ ...item, name: event.target.value })
                }
                label={t("sharedName")}
              />
              <TextField
                value={item.uniqueId || ""}
                onChange={(event) =>
                  setItem({ ...item, uniqueId: event.target.value })
                }
                label={t("deviceIdentifier")}
                helperText={t("deviceIdentifierHelp")}
                disabled={Boolean(uniqueId)}
              />
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<FontAwesomeIcon icon={faAngleDown} />}
            >
              <Typography variant="subtitle1">{t("sharedExtra")}</Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.details}>
              <SelectField
                value={item.groupId}
                onChange={(event) =>
                  setItem({ ...item, groupId: Number(event.target.value) })
                }
                endpoint="/api/groups"
                label={t("groupParent")}
              />
              <TextField
                value={item.phone || ""}
                onChange={(event) =>
                  setItem({ ...item, phone: event.target.value })
                }
                label={t("sharedPhone")}
              />
              <TextField
                value={item.model || ""}
                onChange={(event) =>
                  setItem({ ...item, model: event.target.value })
                }
                label={t("deviceModel")}
              />
              <TextField
                value={item.contact || ""}
                onChange={(event) =>
                  setItem({ ...item, contact: event.target.value })
                }
                label={t("deviceContact")}
              />
              <SelectField
                value={item.category || "default"}
                onChange={(event) =>
                  setItem({ ...item, category: event.target.value })
                }
                data={deviceCategories
                  .map((category) => ({
                    id: category,
                    name: t(
                      `category${category.replace(/^\w/, (c) =>
                        c.toUpperCase()
                      )}`
                    ),
                  }))
                  .sort((a, b) => {
                    if (a.id === "default") return -1;
                    if (b.id === "default") return 1;
                    return a.name.localeCompare(b.name);
                  })}
                label={t("deviceCategory")}
              />
              <SelectField
                value={item.calendarId}
                onChange={(event) =>
                  setItem({ ...item, calendarId: Number(event.target.value) })
                }
                endpoint="/api/calendars"
                label={t("sharedCalendar")}
              />
              <TextField
                label={t("userExpirationTime")}
                type="date"
                value={
                  item.expirationTime
                    ? item.expirationTime.split("T")[0]
                    : "2099-01-01"
                }
                onChange={(e) => {
                  if (e.target.value) {
                    setItem({
                      ...item,
                      expirationTime: new Date(e.target.value).toISOString(),
                    });
                  }
                }}
                disabled={!admin}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={item.disabled}
                    onChange={(event) =>
                      setItem({ ...item, disabled: event.target.checked })
                    }
                  />
                }
                label={t("sharedDisabled")}
                disabled={!admin}
              />
            </AccordionDetails>
          </Accordion>
          {item.id && (
            <Accordion>
              <AccordionSummary
                expandIcon={<FontAwesomeIcon icon={faAngleDown} />}
              >
                <Typography variant="subtitle1">
                  {t("attributeDeviceImage")}
                </Typography>
              </AccordionSummary>
              <AccordionDetails className={classes.details}>
                <DropzoneArea
                  dropzoneText={t("sharedDropzoneText")}
                  acceptedFiles={["image/*"]}
                  filesLimit={1}
                  onChange={handleFiles}
                  showAlerts={false}
                  maxFileSize={500000}
                />
              </AccordionDetails>
            </Accordion>
          )}
          <EditAttributesAccordion
            attributes={item.attributes}
            setAttributes={(attributes) => setItem({ ...item, attributes })}
            definitions={{ ...commonDeviceAttributes, ...deviceAttributes }}
            backgroundColor={backgroundColor}
            textColor={textColor}
            secondaryColor={secondaryColor}
            iconColor={iconColor}
            setBackgroundColor={setBackgroundColor}
            setTextColor={setTextColor}
            setSecondaryColor={setSecondaryColor}
            setIconColor={setIconColor}
          />
        </>
      )}
    </EditItemView>
  );
};

export default DevicePage;

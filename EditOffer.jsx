import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import {
  TextField,
  Button,
  FormControl,
  FormHelperText,
  Box,
  Typography,
  Divider,
  MenuItem,
  CircularProgress,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
} from "@mui/material";
import { Container } from "@mui/system";
import OfferService from "../Services/OfferService";
import TierService from "../Services/TierService";
import AttachFileIcon from "@mui/icons-material/AttachFile";

// Validation schema
const schema = Yup.object().shape({
  tierId: Yup.string().required("Tier ID is required"),
  offerTitle: Yup.string().required("Offer title is required"),
  offerDescription: Yup.string().required("Offer description is required"),
  image: Yup.mixed(),
  benefit: Yup.number().required("Benefit is required"),
  status: Yup.boolean().required("Status is required"),
});

const EditOffer = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [offer, setOffer] = useState({});
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileInfo, setFileInfo] = useState({ name: "", size: 0 });

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const response = await OfferService.getOfferById(id);
        setOffer(response.data);
      } catch (error) {
        console.error("Error fetching offer:", error);
      }
    };

    const fetchTiers = async () => {
      try {
        const response = await TierService.getTiersByPartnerId(
          "5ef61c8d-c9eb-4ad1-aadd-041a5a889c33"
        );
        setTiers(response.data);
      } catch (error) {
        console.error("Error fetching tiers:", error);
      }
    };

    fetchOffer();
    fetchTiers();
  }, [id]);

  const handleSubmit = (values) => {
    setLoading(true);
    const { image, ...value } = values;
    const reader = new FileReader();
    reader.onload = () => {
      const imageData = reader.result;
      const base64Image = imageData.split(",")[1];
      const updatedOffer = { ...value, imageUrl: base64Image };
      console.log("Updating offer:", updatedOffer);
      OfferService.updateOffers(updatedOffer, id)
        .then((response) => {
          console.log("Updated offer:", response.data);
          navigate(-1);
        })
        .catch((error) => {
          console.error("Error updating offer", error);
        })
        .finally(() => {
          setLoading(false);
        });
    };
    reader.readAsDataURL(values.image);
  };

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        p: 3,
        bgcolor: "#f9f9f9",
        borderRadius: 2,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        width: "100%",
      }}
    >
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", color: "#4A4A4A", mb: 2 }}
          >
            Edit Offer
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Formik
            initialValues={{
              tierId: offer.tierId,
              offerTitle: offer.offerTitle,
              offerDescription: offer.offerDescription,
              image: offer.imageUrl,
              benefit: offer.benefit,
              status: offer.status,
            }}
            validationSchema={schema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, setFieldValue, values }) => (
              <Form>
                {/* Tier ID */}
                <Box mb={3}>
                  <FormControl fullWidth>
                    <Field
                      name="tierId"
                      as={TextField}
                      select
                      label="Select Tier"
                      variant="outlined"
                      onChange={(event) =>
                        setFieldValue("tierId", event.target.value)
                      }
                    >
                      {tiers.length > 0 ? (
                        tiers.map((tier) => (
                          <MenuItem key={tier.tierId} value={tier.tierId}>
                            {tier.tierName}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No tiers available</MenuItem>
                      )}
                    </Field>
                    <ErrorMessage name="tierId" component={FormHelperText} />
                  </FormControl>
                </Box>
                {/* Offer Title */}
                <Box mb={3}>
                  <FormControl fullWidth error={!!ErrorMessage.offerTitle}>
                    <Field
                      name="offerTitle"
                      as={TextField}
                      label="Offer Title"
                      variant="outlined"
                    />
                    <ErrorMessage name="offerTitle">
                      {" "}
                      {(msg) => <FormHelperText>{msg}</FormHelperText>}{" "}
                    </ErrorMessage>
                  </FormControl>
                </Box>
                {/* Offer Description */}
                <Box mb={3}>
                  <FormControl
                    fullWidth
                    error={!!ErrorMessage.offerDescription}
                  >
                    <Field
                      name="offerDescription"
                      as={TextField}
                      label="Offer Description"
                      variant="outlined"
                      multiline
                      rows={4}
                    />
                    <ErrorMessage name="offerDescription">
                      {" "}
                      {(msg) => <FormHelperText>{msg}</FormHelperText>}{" "}
                    </ErrorMessage>
                  </FormControl>
                </Box>
                {/* Image */}
                <Box mb={3} display="flex" alignItems="center">
                  <FormControl fullWidth error={!!ErrorMessage.image}>
                    <input
                      type="file"
                      name="image"
                      accept=".jpg, .png"
                      onChange={(event) => {
                        const file = event.target.files[0];
                        setFieldValue("image", file);
                        if (file) {
                          setFileInfo({ name: file.name, size: file.size });
                        } else {
                          setFileInfo({ name: "", size: 0 });
                        }
                      }}
                      style={{ display: "none" }}
                      id="image-upload"
                    />
                    <label htmlFor="image-upload">
                      <Button
                        variant="contained"
                        component="span"
                        startIcon={<AttachFileIcon />}
                      >
                        {values.image ? "Image Selected" : "Upload Image"}
                      </Button>
                    </label>
                    <ErrorMessage name="image">
                      {" "}
                      {(msg) => <FormHelperText>{msg}</FormHelperText>}{" "}
                    </ErrorMessage>
                  </FormControl>
                  {fileInfo.name && (
                    <Typography variant="body2" sx={{ ml: 2 }}>
                      {fileInfo.name} ({(fileInfo.size / 1024).toFixed(2)} KB)
                    </Typography>
                  )}
                </Box>
                {/* Benefit */}
                <Box mb={3}>
                  <FormControl fullWidth error={!!ErrorMessage.benefit}>
                    <Field
                      name="benefit"
                      as={TextField}
                      label="Benefit"
                      type="number"
                      variant="outlined"
                    />
                    <ErrorMessage name="benefit">
                      {" "}
                      {(msg) => <FormHelperText>{msg}</FormHelperText>}{" "}
                    </ErrorMessage>
                  </FormControl>
                </Box>
                {/* Status */}
                <Box mb={3}>
                  <FormControl fullWidth>
                    <FormControlLabel
                      control={
                        <Field
                          name="status"
                          as={Switch}
                          color="primary"
                          onChange={(event) =>
                            setFieldValue("status", event.target.checked)
                          }
                        />
                      }
                      label="Status"
                    />
                    <ErrorMessage name="status">
                      {" "}
                      {(msg) => (
                        <FormHelperText error>{msg}</FormHelperText>
                      )}{" "}
                    </ErrorMessage>
                  </FormControl>
                </Box>
                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting || loading}
                  variant="contained"
                  color="primary"
                  sx={{ width: "100%", mt: 2 }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Update Offer"
                  )}
                </Button>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </Container>
  );
};

export default EditOffer;

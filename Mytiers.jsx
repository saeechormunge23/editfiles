import React, { useEffect, useState } from "react";
import { Paper, Typography, Box } from "@mui/material";

const Tier = ({ tiers, userPoints }) => {
  // Sort tiers by trigger amount
  const sortedTiers = tiers.sort((a, b) => a.triggerAmount - b.triggerAmount);

  // Maximum trigger amount for scaling
  const maxPoints = sortedTiers[sortedTiers.length - 1]?.triggerAmount || 1;

  // Current tier
  const currentTier = sortedTiers.reduce((acc, tier) => {
    return userPoints >= tier.triggerAmount ? tier : acc;
  }, null);

  const [animatedPoints, setAnimatedPoints] = useState(0);

  useEffect(() => {
    let animationFrame;
    const duration = 2000; // Animation duration in ms
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1); // Progress between 0 and 1
      setAnimatedPoints(Math.floor(progress * userPoints));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [userPoints]);

  return (
    <Paper
      sx={{
        p: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "40vw",
        maxWidth: "1000px",
        margin: "0 auto",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        background: "linear-gradient(to bottom,#ffc300, #FFF8DC)",
        backgroundSize: "400% 400%",
        animation: "shinyGold 3s linear infinite",
        borderRadius: "10px",
        "@keyframes shinyGold": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      }}
    >
      {/* Current Tier */}
      {currentTier && (
        <Box
          sx={{
            textAlign: "center",
            mb: 3,
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                fontFamily: "Georgia, serif",
                color: "#fff",
                fontSize: "1.6rem",
                textShadow: "1px 1px 4px rgba(0, 0, 0, 0.5)",
                marginLeft: "0px",
              }}
            >
              {currentTier.tierName}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontWeight: "bold",
                fontFamily: "Georgia, serif",
                color: "#fff",
                marginLeft: "3vw",
              }}
            >
              {animatedPoints} Points
            </Typography>
          </div>
          <div>
            <Typography
              variant="body1"
              sx={{
                fontWeight: "bold",
                fontFamily: "Georgia, serif",
                color: "#fff",
              }}
            >
              Date: "13-12-2024"
            </Typography>
          </div>
        </Box>
      )}

      {/* Horizontal Progress Bar */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            mb: 1,
          }}
        >
          {sortedTiers.map((tier) => {
            const isActive = animatedPoints >= tier.triggerAmount;
            return (
              <Typography
                key={tier.name}
                variant="body2"
                sx={{
                  fontWeight: isActive ? "bold" : "normal",
                  fontSize: isActive ? "0.75rem" : "0.60rem",
                  fontFamily: "Georgia, serif",
                  color: isActive ? "#fff" : "#C2A679",
                  animation: isActive ? "blinking 1.5s 1" : "none",
                  "@keyframes blinking": {
                    "0%": { opacity: 1 },
                    "50%": { opacity: 0.5 },
                    "100%": { opacity: 1 },
                  },
                }}
              >
                {tier.tierName}
              </Typography>
            );
          })}
        </Box>
        <Box
          sx={{
            width: "100%",
            position: "relative",
            height: "15px",
            borderRadius: "10px",
            backgroundColor: "#e7ceadc2",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              width: `${(animatedPoints / maxPoints) * 100}%`,
              height: "100%",
              background: "white",
              backgroundSize: "200% 200%",
              borderRadius: "10px",
              animation: "shinyRed 3s linear infinite",
              "@keyframes shinyRed": {
                "0%": { backgroundPosition: "0% 50%" },
                "50%": { backgroundPosition: "100% 50%" },
                "100%": { backgroundPosition: "0% 50%" },
              },
            }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            mt: 1,
          }}
        >
          {sortedTiers.map((tier) => {
            const isActive = animatedPoints >= tier.triggerAmount;
            return (
              <Typography
                key={tier.name}
                variant="body2"
                sx={{
                  fontWeight: isActive ? "bold" : "normal",
                  fontSize: isActive ? "0.75rem" : "0.60rem",
                  fontFamily: "Georgia, serif",
                  color: isActive ? "#fff" : "#C2A679",
                  animation: isActive ? "blinking 1.5s 1" : "none",
                  "@keyframes blinking": {
                    "0%": { opacity: 1 },
                    "50%": { opacity: 0.5 },
                    "100%": { opacity: 1 },
                  },
                }}
              >
                {tier.triggerAmount}
              </Typography>
            );
          })}
        </Box>
      </Box>

      {/* Points Needed for Next Tier */}
      {sortedTiers.some((tier) => userPoints < tier.triggerAmount) && (
        <Box
          sx={{
            mt: 3,
            textAlign: "start",
            display: "flex",
            alignSelf: "baseline",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontWeight: "bold",
              fontFamily: "Georgia, serif",
              color: "#fff",
              mb: 1,
              fontSize: "0.75rem",
              alignSelf: "baseline",
            }}
          >
            Points Needed for Next Tier:
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontWeight: "bold",
              fontFamily: "Georgia, serif",
              color: "#E63946",
              marginLeft: "5px",
            }}
          >
            {sortedTiers.find((tier) => userPoints < tier.triggerAmount)
              .triggerAmount - userPoints}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default Tier;

import { Request, Response } from "express";
import { Invite } from "../models";
import jwt from "jsonwebtoken";
import { TripMember } from "../models";
// import { transporter } from "../configMailer";
import { Resend } from "resend";

export const sendInvite = async (req: Request, res: Response) => {
  const { tripId } = req.params; // get the trip ID from the request parameters
  const { name, email } = req.body; // get the invitee's name and email from the request body
  try {
    if (process.env.JWT_SECRET) {
      const inviteToken = jwt.sign({ email, tripId }, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });
      await Invite.create({
        email,
        token: inviteToken,
        tripId,
        expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      }); // Save the invite to the database
      const inviteLink = `${process.env.CLIENT_URL}/accept-invite?token=${inviteToken}`; // create an invite link with the token

      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: `TravelCrew <${process.env.EMAIL_DEV}>`,
        to: email,
        subject: "Join my trip in TravelCrew!",
        html: `
          <h2>Hello, ${name}!</h2>
          <p>You're invited to join my trip in TravelCrew, create an account or log in to become a crew member.</p>
          <a href="${inviteLink}" target="_blank">Accept Invitation</a>
          <p>This link will expire in 24 hours.</p>
        `,
      });
      res.status(200).json({ msg: "Invite sent!" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const acceptInvitedMember = async (req: Request, res: Response) => {
  //verify token, find invite, add user to trip, delete invite
  const { inviteToken } = req.body;
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ msg: "Missing credentials." });

  try {
    const decoded = jwt.verify(
      inviteToken,
      process.env.JWT_SECRET as string,
    ) as {
      email: string;
      tripId: number;
    };

    const invite = await Invite.findOne({ where: { token: inviteToken } });

    if (!invite) {
      return res.status(404).json({ msg: "Invite not found" });
    }

    const existing = await TripMember.findOne({
      where: { userId, tripId: decoded.tripId },
    });

    if (!existing) {
      await TripMember.create({
        userId,
        tripId: invite.tripId,
      });
    }

    await Invite.destroy({
      where: { token: inviteToken },
    });

    res.status(200).json({
      msg: "Joined trip successfully!",
      tripId: invite.tripId,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ msg: "Invalid or expired invite link." });
  }
};

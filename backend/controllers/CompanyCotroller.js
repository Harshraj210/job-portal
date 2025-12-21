import Company from "../models/CompanyModel.js";

const registerCompany = async (req, res) => {
  try {
    const { companyName } = req.body;

    if (!companyName) {
      return res.status(400).json({ message: "Company name is required" });
    }
    const existing = await Company.findOne({ name: companyName });
    if (existing) {
      return res.status(400).json({ message: "Company already exists" });
    }

    const newCompany = await Company.create({
      name: companyName,
    });

    return res
      .status(201)
      .json({ message: "Company registered successfully", newCompany });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

const getCompany = async (req, res) => {
  try {
    const userId = req.user.id;
    const companies = await Company.find({ userId });
    if (!companies) {
      return res.status(404).json({ message: "No companies found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;
    const companyData = await Company.findById(companyId);
    if (!companyData) {
      return res.status(404).json({ message: "Company not found" });
    }
    return res.status(200).json({ companyData });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

const updateCompany = async (req, res) => {
  try {
    const { companyName, website, description } = req.body;

    const updatedData = { companyName, website, description };

    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!updatedCompany) {
      return res.status(404).json({ message: "Company not found" });
    }

    return res
      .status(200)
      .json({ message: "Company updated successfully", updatedCompany });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export { registerCompany, getCompany, updateCompany, getCompanyById };

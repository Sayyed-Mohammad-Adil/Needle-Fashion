import express from 'express';
import {
  getSiteConfig,
  updateCommerceSettings,
  updatePageSection,
  updateNavigation,
  updateFooter,
  resetSiteConfig,
} from '../controllers/siteConfig.controller';
import { protect, admin } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', getSiteConfig);
router.put('/commerce', protect, admin, updateCommerceSettings);
router.put('/navigation', protect, admin, updateNavigation);
router.put('/footer', protect, admin, updateFooter);
router.put('/section/:pageKey/:sectionKey', protect, admin, updatePageSection);
router.post('/reset', protect, admin, resetSiteConfig);

export default router;


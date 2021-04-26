<template>
  <div class="DHAHelpCenter">
    <div class="PageTitle">
      <h2><translate>DHA Help Center</translate></h2>
      <el-button type="text" class="Back IconLeft" @click="goBack">
        <fa icon="angle-left" />
        <translate>Go back</translate>
      </el-button>
    </div>

    <el-card :body-style="{ padding: '0px' }" class="HelpCard">
      <el-tabs tab-position="left">
        <el-tab-pane :label="$gettext('Terms of Use') | translate">
          <h2><translate>Terms of Use</translate></h2>
          <p>
            <translate>
              Please read these Terms of Use carefully before installing,
              accessing and using the Digital Health Atlas (the “DHA”).
            </translate>
          </p>
          <p>
            <translate>
              These Terms of Use governs your use of the DHA. By installing,
              accessing and/or using the DHA, you enter into an agreement with
              the World Health Organization (“WHO”) and you accept all terms,
              conditions, and requirements of the Agreement.
            </translate>
          </p>
          <p>
            <translate>
              In these Terms of Use “you”, “your” means: (i) the individual
              user; and (ii) the entity on whose behalf the individual user is
              accessing and using the DHA. The individual user and the relevant
              entity are joint and severally responsible for the use of the DHA.
            </translate>
          </p>
          <h4><translate>1. About the DHA</translate></h4>
          <p>
            <translate>
              The DHA is an open-source web platform made available by WHO to
              support governments, product owners, implementers, investors and
              donors to better coordinate digital health activities. It can
              answer the question of which software applications are being used
              at which health facilities in any given country.
            </translate>
          </p>
          <h4><translate>2. Registration</translate></h4>
          <p>
            2.1 To use the DHA, you must first register via:
            <a href="mailto:https://digitalhealthatlas.org/en/-/login"
              ><translate
                >https://digitalhealthatlas.org/en/-/login</translate
              ></a
            >
          </p>
          <p>
            <translate>2.2 Once registered, users are able to:</translate>
          </p>
          <ol class="custom">
            <li>
              <translate>
                View digital health projects at global and country level
              </translate>
            </li>
            <li>
              <translate>
                Research projects to design a health intervention
              </translate>
            </li>
            <li>
              <translate>Registerer digital health projects</translate>
            </li>
            <li>
              <translate>Export projects in a portable format</translate>
            </li>
            <li>
              <translate>
                As an investor/country admin add on to the default
                questionnaire.
              </translate>
            </li>
          </ol>
          <h4>
            <translate>3. Rights and permissions</translate>
          </h4>
          <p>
            <translate>
              3.1 You agree to only upload or submit material that you are
              permitted to and that does not violate any rights, including
              intellectual property rights. Where you are not the owner of the
              material, you represent and warrant that you have the express
              permission from the owner of the material to upload, use or submit
              the material.
            </translate>
          </p>
          <p>
            <translate>
              3.2 By uploading or submitting material to the DHA, you agree that
              such submission is non-confidential for all purposes. If you wish
              to keep any information, ideas, concepts or inventions private or
              proprietary, do not submit or upload them to the DHA.
            </translate>
          </p>
          <p>
            <translate>
              3.3 You are solely responsible for any damages resulting from any
              infringements of copyrights, trademark rights, propriety rights,
              or any other harm resulting from any material that you have
              uploaded or submitted.
            </translate>
          </p>
          <p>
            <translate>
              3.4 By uploading material to the DHA, you agree that the
              information will be made available under the Creative Commons
              Attribution 3.0 IGO licence (CC BY 3.0 IGO)</translate>
              <a href="http://creativecommons.org/licenses/by/3.0/igo/legalcode"
                ><translate>http://creativecommons.org/licenses/by/3.0/igo/legalcode</translate></a
              ><translate>
              , which permits unrestricted use, distribution and reproduction
              in any medium, provided the original work is properly cited.</translate>
            </translate>
          </p>
          <h4>
            <translate>4. Maps</translate>
          </h4>
          <p>
            <translate>
              The boundaries and names shown and the designations used on the
              maps used in the DHA do not imply the expression of any opinion
              whatsoever on the part of WHO concerning the legal status of any
              country, territory, city or area or of its authorities, or
              concerning the delimitation of its frontiers or boundaries. Dotted
              and dashed lines on maps represent approximate border lines for
              which there may not yet be full agreement.
            </translate>
          </p>
          <h4>
            <translate>5. Use of WHO name and emblem</translate>
          </h4>
          <p>
            <translate>You shall not:</translate>
          </p>
          <ol class="lower-roman">
            <li>
              <translate>
                in connection with your use of the DHA, state or imply that WHO
                endorses or is affiliated with you, or WHO endorses any entity,
                organization, company, or product, or any particular digital
                health activity; and
              </translate>
            </li>
            <li>
              <translate>
                use the name or emblem of WHO in any way. All requests to use
                the WHO name and/or emblem require advance written approval of
                WHO.
              </translate>
            </li>
          </ol>
          <h4>
            <translate>6. Personal Information </translate>
          </h4>
          <p>
            <translate>
              6.1 The only personal information that we will collect about you
              is the personal information that you provide to us when you
              register with us or when you communicate with us through our
              website. We will at any time, at your request, provide you with a
              copy of any personal information that we are holding about you.
            </translate>
          </p>
          <p>
            <translate>
              6.2 We may use your personal information for the following
              purposes:
            </translate>
          </p>
          <ul>
            <li>
              <translate>
                To provide information or services to you as requested by you.
              </translate>
            </li>
            <li>
              <translate>
                To let you know about information and services in which you may
                be interested.
              </translate>
            </li>
            <li>
              <translate>For internal review.</translate>
            </li>
            <li>
              <translate>To improve the content of the website.</translate>
            </li>
            <li>
              <translate>
                To customize the content and /or layout of the website for each
                individual user.
              </translate>
            </li>
            <li>
              <translate>
                To notify users about updates to the website.
              </translate>
            </li>
            <li>
              <translate>
                To compile and disclose statistics about our users and their
                preferences. However, these statistics are anonymous and do not
                identify individual users.
              </translate>
            </li>
          </ul>
          <p>
            <translate>
              6.3 Where you have provided personal information of another
              individual you represent and warrant that you have:
            </translate>
          </p>
          <ol class="lower-roman">
            <li>
              <translate>
                advised the individual the purpose(s) for which their personal
                information will be provided; and
              </translate>
            </li>
            <li>
              <translate>
                obtained their express consent to provide their personal
                information for such purposes.
              </translate>
            </li>
          </ol>
          <h4>
            <translate>7. Disclaimers by WHO</translate>
          </h4>
          <p>
            <translate>
              7.1 Information or content about individual digital health
              activities contained within the DHA is submitted by users. In no
              event shall WHO be responsible for the accuracy, completeness or
              usefulness of material uploaded by any user on the DHA.
            </translate>
          </p>
          <p>
            <translate>
              7.2 The DHA, including any information contained within it, is
              made available to you without any warranty of any kind, either
              expressed or implied. You will be solely responsible for your use
              of the DHA. In no event shall WHO be liable for any damages
              arising from such use.
            </translate>
          </p>
          <p>
            <translate>
              7.3 The DHA may contain links to resources on external websites.
              WHO is not responsible for the accuracy or content of any external
              link. The presence of any resource or external link on the DHA
              does not imply that the resource, or its author or entity, is
              endorsed or recommended by the WHO. These links are provided for
              convenience only.
            </translate>
          </p>
          <p>
            <translate>
              7.4 The mention of specific companies or of certain manufacturers'
              products does not imply that they are endorsed or recommended by
              WHO in preference to others of a similar nature that are not
              mentioned.
            </translate>
          </p>
          <h4>
            <translate>
              8. Message Boards and other interactive features
            </translate>
          </h4>
          <p>
            <translate>
              8.1 Message boards, bulletin boards, blogs, and other services may
              be available on or through the DHA. In addition to any other rules
              or regulations that WHO may post in connection with these
              particular services, you shall not upload, post, transmit,
              distribute, or otherwise publish through the DHA or any service or
              feature made available on or through the DHA any materials which:
            </translate>
          </p>
          <ol class="lower-roman">
            <li>
              <translate>
                restrict or inhibit any other user from using and enjoying the
                DHA;
              </translate>
            </li>
            <li>
              <translate>
                are fraudulent, unlawful, threatening, abusive, harassing,
                libellous, defamatory, or offensive;
              </translate>
            </li>
            <li>
              <translate>
                constitute or encourage conduct that would constitute a criminal
                offense, give rise to civil liability or otherwise violate any
                local, state, federal, or international law;
              </translate>
            </li>
            <li>
              <translate>
                violate, plagiarize, or infringe the rights of third parties,
                including, without limitation, copyright, trademark, trade
                secret, confidentiality, contract, patent, rights of privacy, or
                publicity or any other proprietary rights;
              </translate>
            </li>
            <li>
              <translate>
                contain a virus, spyware, or any other harmful content;
              </translate>
            </li>
            <li>
              <translate>
                contain embedded links or advertising of any kind; or
              </translate>
            </li>
            <li>
              <translate>
                constitute or contain false or misleading indications of origin,
                endorsements, or statements of fact.
              </translate>
            </li>
          </ol>
          <p>
            <translate>
              8.2 WHO reserves the right, but has no obligation, to monitor the
              content of the message boards, bulletin boards, blogs, and other
              services available on the DHA to determine compliance with the
              Terms of Use and any other operating rules we establish. We
              reserve the exclusive right to edit, remove, or refuse to post any
              submitted materials or information. We are not responsible for and
              do not endorse any of the opinions, advice, or statements posted
              in messages, bulletin boards, blogs, and other services. We are
              not responsible for any offensive, defamatory, or obscene posting
              made on the message boards or other features on the Website. We
              reserve the right to refuse to post or to remove any information
              or materials, in whole or in part, that in our sole discretion are
              inappropriate, objectionable or in violation of these Terms. We
              also reserve the right to deny access to the DHA any features of
              the DHA to anyone who violates these Terms or who, in our
              judgment, interferes with the ability of others to enjoy our
              website or infringes the rights of others. WHO assumes no
              liability for any action or inaction with respect to any conduct,
              communication, or posting on the message boards, bulletin boards,
              blogs, or other services on the DHA.
            </translate>
          </p>
          <h4>
            <translate>9. Modification/discontinuation of the DHA </translate>
          </h4>
          <p>
            <translate>
              WHO reserves the right at any time and from time to time to modify
              or discontinue, temporarily or permanently, the DHA, or any means
              of accessing or utilizing the DHA, with or without prior notice to
              you.
            </translate>
          </p>
          <h4>
            <translate>10. Indemnification of WHO</translate>
          </h4>
          <p>
            <translate>
              You agree to indemnify WHO for, and hold WHO harmless against, any
              claims and liabilities, including reasonable attorneys' fees and
              costs, arising from your use of the DHA and/or breach of these
              Terms of Use.
            </translate>
          </p>
          <h4>
            <translate>11. Dispute Resolution</translate>
          </h4>
          <p>
            <translate>
              Any dispute relating to the interpretation or application of these
              Terms of Use shall, unless amicably settled, be subject to
              conciliation. In the event of failure of the latter, the dispute
              shall be settled by arbitration. The arbitration shall be
              conducted in accordance with the modalities to be agreed upon by
              the parties or, in the absence of agreement, with the rules of
              arbitration of the International Chamber of Commerce. The parties
              shall accept the arbitral award as final.
            </translate>
          </p>
          <h4>
            <translate>12. Privileges and Immunities of WHO</translate>
          </h4>
          <p>
            <translate>
              Nothing in or relating to these Terms of Use shall be deemed a
              waiver of any of the privileges and immunities enjoyed by WHO
              under national or international law and/or as submitting WHO to
              any national court jurisdiction.
            </translate>
          </p>
          <h4>
            <translate>13. Entire Agreement</translate>
          </h4>
          <p>
            <translate>
              These Terms of Use constitute the entire agreement between you and
              WHO with respect to its subject matter. WHO is not bound by any
              additional terms that may appear in any communication from you.
              Any amendment of these Terms of Use shall be subject to WHO’s
              written agreement, it being agreed that WHO may amend these Terms
              and Conditions from time to time at its sole discretion, without
              prior notice.
            </translate>
          </p>
        </el-tab-pane>

        <el-tab-pane :label="$gettext('Contact') | translate">
          <h2>
            <translate>Contact</translate>
          </h2>
          <p>
            <translate>
              If you have further questions about the DHA, do not hesitate to
              get in touch using the details below:
            </translate>
          </p>
          <p>
            <b><translate>Email:</translate></b
            >&nbsp;<a href="mailto:digital-health-atlas@who.int">
              digital-health-atlas@who.int
            </a>
          </p>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="less">
@import "~assets/style/variables.less";
@import "~assets/style/mixins.less";

.DHAHelpCenter {
  .HelpCard {
    width: @cardSizeMedium;
    margin: 0 auto 80px;

    .el-tabs {
      .el-tabs__header {
        margin: 30px 0 0;

        .el-tabs__nav {
          .el-tabs__item {
            padding: 0 30px;
            color: @colorTextSecondary;

            &:hover {
              color: @colorTextPrimary;
            }

            &.is-active {
              color: @colorBrandPrimary;
            }
          }
        }
      }

      .el-tabs__content {
        padding: 20px 60px 80px;
        transform: translateX(-1px);
        box-shadow: inset 2px 0 0 0 @colorGrayLightest;

        h2 {
          margin-top: 28px;
          font-size: @fontSizeTitle;
        }

        h4 {
          margin-top: 42px;
          font-size: @fontSizeMedium;
          color: @colorBrandPrimary;
        }

        p,
        li {
          font-size: @fontSizeBase;
          line-height: 21px;

          a {
            color: @colorBrandPrimary;

            &:hover {
              text-decoration: none;
            }
          }
        }

        ol {
          &.custom {
            list-style: none;
            counter-reset: custom-counter;
            li {
              counter-increment: custom-counter;

              &::before {
                content: "(" counter(custom-counter) ") ";
              }
            }
          }

          &.lower-roman {
            list-style: none;
            counter-reset: lower-roman-counter;
            li {
              counter-increment: lower-roman-counter;

              &::before {
                content: "(" counter(lower-roman-counter, lower-roman) ") ";
              }
            }
          }

          // &.lower-roman {
          //   list-style-type: lower-roman;
          // }
        }

        ul {
          li {
            margin-left: 20px;
          }
        }

        ol,
        ul {
          li {
            margin-bottom: 5px;
          }
        }

        .el-button {
          margin: 10px 0;
        }
      }
    }
  }

  .GetToolkit {
  }
}
</style>

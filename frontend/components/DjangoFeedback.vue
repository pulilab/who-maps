<template>
  <div class="DjangoFeedback">
    <vue-django-feedback
      v-if="token"
      :name="profile.name"
      :email="profile.email"
      :csrf-token="token" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  computed: {
    ...mapGetters({
      profile: 'user/getProfile',
      token: 'user/getToken'
    })
  }
};
</script>

<style lang="less">
  @import "~assets/style/variables.less";
  @import "~assets/style/mixins.less";
  @import "../node_modules/vue-django-feedback/dist/styles/variables";
  @import "../node_modules/vue-django-feedback/dist/styles/main";

  .DjangoFeedback {
    vue-django-feedback {
      .vue-django-feedback {
        z-index: 5000;
        font-family: Arial, sans-serif;
        color: @colorTextPrimary;
      }

      .feedback-button {
        background-color: @colorBrandPrimary;

        .icon.icon-opened {
          > span {
            font-weight: 700 !important;
          }
        }
      }

      .pop-up-container {
        .header {
          background-color: @colorBrandPrimary;

          .icon.icon-opened {
            > span {
              font-weight: 700 !important;
            }
          }

          h2 {
            font-weight: 700;
            letter-spacing: -0.5px;
          }
        }

        .message-container {
          h4 {
            color: @colorPublished;

            &.error {
              color: @colorDanger;
            }
          }

          p {
            color: @colorTextSecondary;
          }
        }

        .pop-up-controls {
          border-color: @colorGrayLight;
          border-radius: 0;

          .error-info {
            font-weight: 700;
            color: @colorDanger;

            .icon.icon-danger span {
              font-weight: 700;
            }
          }

          .actions {
            button {
              color: @colorBrandPrimary;
              font-weight: 700;
              text-transform: none;

              &:hover {
                color: @colorBrandPrimaryLight;
              }

              &:disabled {
                color: @colorTextMuted;
              }
            }
          }
        }

        .input-container {
          label {
            color: @colorTextPrimary;
            font-weight: 700;
          }

          input,
          textarea {
            color: @colorTextPrimary;
            border-color:@colorTextMuted;
            border-radius: 0;

            &:hover,
            &:focus {
              border-color: @colorGray;
            }

            &.error {
              border-color: @colorDanger;
            }
          }

          .feedback {
            color: @colorTextMuted;

            .errors {
              color: @colorDanger;
            }
          }
        }

        .user-block {
          .user {
            .name {
              font-weight: 700;
            }

            .email {
              color: @colorTextSecondary;
            }
          }
        }

      }
    }
  }
</style>

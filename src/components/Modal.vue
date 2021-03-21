<template>
  <div class="modal fade" id="shareModal" tabindex="-1" role="dialog" aria-labelledby="share modal">
    <div class="modal-dialog modal-sm" role="document">
      <div class="modal-content">
        <div class="modal-body">
          <form class="form-inline">
            <div class="form-group">
              <textarea class="form-control" id="url-text" rows="1" readonly></textarea>
            </div>
            <button type="button" class="btn btn-primary">Copy</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
.modal-dialog {
  margin: 40% auto;
  width: 455px;
}

.modal-content {
  background-color: #272727;
  border: 1px solid rgba(115, 115, 115, 0.2);
}

.modal-body textarea {
  overflow: hidden;
  resize: none;
  width: 360px !important;
}
</style>
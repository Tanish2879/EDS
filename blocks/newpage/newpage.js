export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.classList.add('inner-card');
  });
}
